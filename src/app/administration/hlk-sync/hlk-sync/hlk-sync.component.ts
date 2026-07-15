import { Component, OnInit, TemplateRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { TimeoutError } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {
  HlkSyncService,
  HlkSyncReport,
  HlkSyncFicheSample,
} from 'src/app/core/services/hlk-sync.service';
import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeFr, 'fr');

type SyncMode = 'sim' | 'real';

@Component({
  selector: 'app-hlk-sync',
  templateUrl: './hlk-sync.component.html',
  styleUrls: ['./hlk-sync.component.css']
})
export class HlkSyncComponent implements OnInit {

  private static readonly STORAGE_KEY_SIM = 'hlk-sync-last-sim-report';
  private static readonly STORAGE_KEY_REAL = 'hlk-sync-last-real-report';

  // Au-delà de 30 fiches / contrats, le back n'envoie qu'un échantillon.
  public static readonly SAMPLE_CAP = 30;

  // Le run réel est volontairement désactivé : seule la simulation est
  // exposée pour l'instant. Repasser à false pour le réactiver.
  public realDisabled = true;

  public simLoading = false;
  public realLoading = false;

  public simReport: HlkSyncReport | null = null;
  public realReport: HlkSyncReport | null = null;

  public simError: string | null = null;
  public realError: string | null = null;

  // États d'ouverture des accordéons (une clé par bloc dépliable).
  public open: { [key: string]: boolean } = {};
  public copiedMode: SyncMode | null = null;

  // Modales ngx-bootstrap
  public detailModalRef?: BsModalRef;
  public confirmModalRef?: BsModalRef;
  public detailFiche: HlkSyncFicheSample | null = null;
  public confirmWithoutSim = false;

  constructor(
    private hlkSyncService: HlkSyncService,
    private modalService: BsModalService,
  ) { }

  ngOnInit(): void {
    this.simReport = this.restore(HlkSyncComponent.STORAGE_KEY_SIM);
    this.realReport = this.restore(HlkSyncComponent.STORAGE_KEY_REAL);
  }

  // ---------- Étape 1 : simulation ----------

  public simulate(): void {
    if (this.simLoading) {
      return;
    }
    this.simLoading = true;
    this.simError = null;
    this.copiedMode = null;

    this.hlkSyncService.syncBeneficiaries(true).subscribe(
      (report: HlkSyncReport) => {
        this.simReport = report;
        this.persist(HlkSyncComponent.STORAGE_KEY_SIM, report);
        this.simLoading = false;
      },
      (error: any) => {
        this.simError = this.buildErrorMessage(error);
        this.simLoading = false;
      }
    );
  }

  // ---------- Étape 2 : run réel ----------

  /**
   * Clic sur "Lancer la synchronisation réelle" : ouvre une modale de
   * confirmation, dont le message dépend du fait qu'une simulation a tourné.
   */
  public askRealConfirmation(template: TemplateRef<any>): void {
    if (this.realDisabled || this.realLoading) {
      return;
    }
    this.confirmWithoutSim = !this.simReport;
    this.confirmModalRef = this.modalService.show(template, { class: 'modal-md' });
  }

  public confirmReal(): void {
    this.confirmModalRef?.hide();
    this.runReal();
  }

  public declineReal(): void {
    this.confirmModalRef?.hide();
  }

  private runReal(): void {
    this.realLoading = true;
    this.realError = null;
    this.copiedMode = null;

    this.hlkSyncService.syncBeneficiaries(false).subscribe(
      (report: HlkSyncReport) => {
        // On conserve la simulation à l'écran pour comparaison visuelle.
        this.realReport = report;
        this.persist(HlkSyncComponent.STORAGE_KEY_REAL, report);
        this.realLoading = false;
      },
      (error: any) => {
        this.realError = this.buildErrorMessage(error);
        this.realLoading = false;
      }
    );
  }

  // ---------- Preview : modale de détail d'une fiche ----------

  public openFicheDetail(fiche: HlkSyncFicheSample, template: TemplateRef<any>): void {
    this.detailFiche = fiche;
    this.detailModalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  public closeDetail(): void {
    this.detailModalRef?.hide();
    this.detailFiche = null;
  }

  // ---------- Accordéons ----------

  public toggle(key: string): void {
    this.open[key] = !this.open[key];
  }

  public isOpen(key: string): boolean {
    return !!this.open[key];
  }

  public get sampleCap(): number {
    return HlkSyncComponent.SAMPLE_CAP;
  }

  // ---------- Copie ----------

  public copyReport(report: HlkSyncReport | null, mode: SyncMode): void {
    if (!report) {
      return;
    }
    const json = JSON.stringify(report, null, 2);
    const done = () => {
      this.copiedMode = mode;
      window.setTimeout(() => (this.copiedMode = null), 2500);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(json).then(done, () => this.fallbackCopy(json, done));
    } else {
      this.fallbackCopy(json, done);
    }
  }

  // ---------- Helpers d'affichage ----------

  public formatDuration(ms: number): string {
    if (ms === null || ms === undefined || isNaN(ms)) {
      return '';
    }
    const totalSeconds = Math.round(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return minutes > 0 ? `${minutes} min ${seconds} s` : `${seconds} s`;
  }

  public errorCount(report: HlkSyncReport | null): number {
    return report && report.errors ? report.errors.length : 0;
  }

  /**
   * Nombre de contrats non reconnus au-delà de l'échantillon affiché.
   */
  public unmatchedRemaining(report: HlkSyncReport | null): number {
    if (!report || !report.preview) {
      return 0;
    }
    const shown = report.preview.unmatched_samples ? report.preview.unmatched_samples.length : 0;
    return Math.max(0, (report.contracts_unmatched || 0) - shown);
  }

  // ---------- Interne ----------

  private restore(key: string): HlkSyncReport | null {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  private persist(key: string, report: HlkSyncReport): void {
    try {
      localStorage.setItem(key, JSON.stringify(report));
    } catch (e) {
      // Stockage indisponible (mode privé, quota) : sans impact fonctionnel.
    }
  }

  private buildErrorMessage(error: any): string {
    if (error instanceof TimeoutError) {
      return "Le délai d'attente a été dépassé côté client. Le traitement peut toutefois s'être "
        + "terminé côté serveur : ne relancez pas immédiatement pour éviter une double exécution, "
        + 'et vérifiez le résultat avant toute nouvelle tentative.';
    }
    if (error instanceof HttpErrorResponse) {
      if (error.status === 504) {
        return 'Le serveur a mis trop de temps à répondre (504). Le traitement peut toutefois '
          + "s'être terminé côté serveur : ne relancez pas immédiatement et vérifiez le résultat.";
      }
      if (error.error && typeof error.error === 'object' && typeof error.error.error === 'string') {
        return error.error.error;
      }
      if (error.error && typeof error.error === 'object' && typeof error.error.message === 'string') {
        return error.error.message;
      }
      if (typeof error.error === 'string' && error.error.length > 0) {
        return error.error;
      }
      return `Une erreur est survenue (HTTP ${error.status}).`;
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'Une erreur est survenue lors de la synchronisation. Réessayez plus tard.';
  }

  private fallbackCopy(text: string, done: () => void): void {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      done();
    } catch (e) {
      // silencieux : la copie n'est qu'un confort
    } finally {
      document.body.removeChild(textarea);
    }
  }
}
