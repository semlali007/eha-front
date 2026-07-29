import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TimeoutError } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {
  HlkSyncService,
  HlkSyncReport,
  HlkSyncFicheSample,
  HlkSyncContractsDetails,
  HlkSyncContractDetail,
} from 'src/app/core/services/hlk-sync.service';
import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeFr, 'fr');

type SyncMode = 'sim' | 'real';
type ContractStatusFilter = 'all' | 'matched' | 'unmatched';

@Component({
  selector: 'app-hlk-sync',
  templateUrl: './hlk-sync.component.html',
  styleUrls: ['./hlk-sync.component.css']
})
export class HlkSyncComponent implements OnInit, OnDestroy {

  private static readonly STORAGE_KEY_SIM = 'hlk-sync-last-sim-report';
  private static readonly STORAGE_KEY_REAL = 'hlk-sync-last-real-report';

  // Au-delà de 30 fiches / contrats, le back n'envoie qu'un échantillon.
  public static readonly SAMPLE_CAP = 30;

  public simLoading = false;
  public realLoading = false;

  // Minuteur « temps écoulé » pendant les traitements (5 à 10 min).
  public nowMs = 0;
  private simStartMs = 0;
  private realStartMs = 0;
  private ticker: any = null;

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
  public contractDetailModalRef?: BsModalRef;
  public detailFiche: HlkSyncFicheSample | null = null;
  public selectedContract: HlkSyncContractDetail | null = null;
  public confirmWithoutSim = false;

  // --- Détail par contrat HLK : filtres + pagination ---
  public contractSearch = '';
  public contractStatus: ContractStatusFilter = 'all';
  public contractMinBen: number | null = null;
  public itemsPerPage = 25;
  public pageSizeOptions = [25, 50];
  public paginationForm!: FormGroup;
  public filteredContracts: HlkSyncContractDetail[] = [];
  public expandedContracts = new Set<string>();

  // --- Aperçu des fiches enrichies : recherche + pagination ---
  public fichesItemsPerPage = 25;
  public fichesPaginationForm!: FormGroup;
  public fichesSearch = '';
  public filteredFiches: HlkSyncFicheSample[] = [];

  // Au-delà de ce nombre, les bénéficiaires sont repliés en « +N autres ».
  public static readonly CHIP_LIMIT = 5;

  constructor(
    private hlkSyncService: HlkSyncService,
    private modalService: BsModalService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.simReport = this.restore(HlkSyncComponent.STORAGE_KEY_SIM);
    this.realReport = this.restore(HlkSyncComponent.STORAGE_KEY_REAL);
    this.paginationForm = this.fb.group({ currentPage: 1 });
    this.fichesPaginationForm = this.fb.group({ currentPage: 1 });
    this.applyContractFilter();
    this.applyFichesFilter();
  }

  ngOnDestroy(): void {
    this.stopTicker();
  }

  // ---------- Minuteur temps écoulé ----------

  private startTicker(): void {
    this.nowMs = Date.now();
    if (this.ticker) {
      return;
    }
    this.ticker = window.setInterval(() => {
      this.nowMs = Date.now();
      if (!this.simLoading && !this.realLoading) {
        this.stopTicker();
      }
    }, 1000);
  }

  private stopTicker(): void {
    if (this.ticker) {
      window.clearInterval(this.ticker);
      this.ticker = null;
    }
  }

  public get simElapsedMs(): number {
    return this.simStartMs ? Math.max(0, this.nowMs - this.simStartMs) : 0;
  }

  public get realElapsedMs(): number {
    return this.realStartMs ? Math.max(0, this.nowMs - this.realStartMs) : 0;
  }

  // ---------- Étape 1 : simulation ----------

  public simulate(): void {
    if (this.simLoading) {
      return;
    }
    this.simLoading = true;
    this.simError = null;
    this.copiedMode = null;
    this.simStartMs = Date.now();
    this.startTicker();

    this.hlkSyncService.syncBeneficiaries(true).subscribe(
      (report: HlkSyncReport) => {
        this.simReport = report;
        this.persist(HlkSyncComponent.STORAGE_KEY_SIM, report);
        this.applyContractFilter();
        this.applyFichesFilter();
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
    if (this.realLoading) {
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
    this.realStartMs = Date.now();
    this.startTicker();

    this.hlkSyncService.syncBeneficiaries(false).subscribe(
      (report: HlkSyncReport) => {
        // On conserve la simulation à l'écran pour comparaison visuelle.
        this.realReport = report;
        this.persist(HlkSyncComponent.STORAGE_KEY_REAL, report);
        this.applyContractFilter();
        this.applyFichesFilter();
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

  // ---------- Détail par contrat HLK ----------

  /**
   * Rapport à utiliser pour le détail par contrat : on privilégie le run réel
   * s'il en contient, sinon la simulation.
   */
  public get detailsReport(): HlkSyncReport | null {
    if (this.realReport && this.realReport.contracts_details) {
      return this.realReport;
    }
    if (this.simReport && this.simReport.contracts_details) {
      return this.simReport;
    }
    return null;
  }

  public get contractsDetails(): HlkSyncContractsDetails | null {
    return this.detailsReport ? this.detailsReport.contracts_details || null : null;
  }

  /**
   * Applique recherche + statut + min bénéficiaires sur la liste pré-triée,
   * et remet la pagination en page 1. L'ordre d'origine (matchés d'abord,
   * puis alphabétique) est préservé par le filtre.
   */
  public applyContractFilter(): void {
    const details = this.contractsDetails;
    const all = details && details.contracts ? details.contracts : [];
    const q = (this.contractSearch || '').trim().toLowerCase();
    const min = this.contractMinBen != null && this.contractMinBen > 0 ? this.contractMinBen : 0;

    this.filteredContracts = all.filter((c) => {
      if (this.contractStatus === 'matched' && !c.is_matched) {
        return false;
      }
      if (this.contractStatus === 'unmatched' && c.is_matched) {
        return false;
      }
      if (min > 0 && (c.nb_beneficiaries || 0) < min) {
        return false;
      }
      if (q) {
        const codeMatch = (c.contract_code || '').toLowerCase().includes(q);
        const benMatch = (c.beneficiaries || []).some((b) => (b || '').toLowerCase().includes(q));
        if (!codeMatch && !benMatch) {
          return false;
        }
      }
      return true;
    });

    if (this.currentPage) {
      this.currentPage.setValue(1);
    }
  }

  public onContractSearchChange(value: string): void {
    this.contractSearch = value;
    this.applyContractFilter();
  }

  public setContractStatus(status: ContractStatusFilter): void {
    this.contractStatus = status;
    this.applyContractFilter();
  }

  public onMinBenChange(value: string): void {
    const parsed = parseInt(value, 10);
    this.contractMinBen = isNaN(parsed) ? null : parsed;
    this.applyContractFilter();
  }

  public onPageSizeChange(value: string): void {
    const parsed = parseInt(value, 10);
    this.itemsPerPage = isNaN(parsed) ? 25 : parsed;
    if (this.currentPage) {
      this.currentPage.setValue(1);
    }
  }

  public resetContractFilters(): void {
    this.contractSearch = '';
    this.contractStatus = 'all';
    this.contractMinBen = null;
    this.applyContractFilter();
  }

  public toggleChips(code: string): void {
    if (this.expandedContracts.has(code)) {
      this.expandedContracts.delete(code);
    } else {
      this.expandedContracts.add(code);
    }
  }

  public isChipsExpanded(code: string): boolean {
    return this.expandedContracts.has(code);
  }

  public visibleBeneficiaries(contract: HlkSyncContractDetail): string[] {
    const list = contract.beneficiaries || [];
    if (this.isChipsExpanded(contract.contract_code)) {
      return list;
    }
    return list.slice(0, HlkSyncComponent.CHIP_LIMIT);
  }

  public hiddenBeneficiariesCount(contract: HlkSyncContractDetail): number {
    const total = contract.beneficiaries ? contract.beneficiaries.length : 0;
    return Math.max(0, total - HlkSyncComponent.CHIP_LIMIT);
  }

  public openContractDetail(contract: HlkSyncContractDetail, template: TemplateRef<any>): void {
    this.selectedContract = contract;
    this.contractDetailModalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  public closeContractDetail(): void {
    this.contractDetailModalRef?.hide();
    this.selectedContract = null;
  }

  // Pagination
  public get currentPage() { return this.paginationForm ? this.paginationForm.get('currentPage') : null; }
  public get currentPageValue(): number { return this.currentPage ? (this.currentPage.value ?? 1) : 1; }
  public get startIndex(): number { return (this.currentPageValue - 1) * this.itemsPerPage; }
  public get endIndex(): number { return Math.min(this.startIndex + this.itemsPerPage, this.filteredContracts.length); }
  public get pagedContracts(): HlkSyncContractDetail[] {
    return this.filteredContracts.slice(this.startIndex, this.endIndex);
  }

  public pageChanged(event: any): void {
    if (this.currentPage) {
      this.currentPage.setValue(event.page);
    }
  }

  // Recherche + pagination de l'aperçu des fiches enrichies

  /**
   * Rapport dont on affiche l'aperçu détaillé (nouvelles filiales, fiches
   * enrichies, contrats non reconnus) : on privilégie le run réel s'il porte
   * un `preview`, sinon la simulation. Le back renvoie désormais `preview`
   * dans les deux modes.
   */
  public get previewReport(): HlkSyncReport | null {
    if (this.realReport && this.realReport.preview) {
      return this.realReport;
    }
    if (this.simReport && this.simReport.preview) {
      return this.simReport;
    }
    return null;
  }

  /**
   * Liste source des fiches à enrichir : on privilégie `preview.fiches`
   * (complet) et on retombe sur `preview.fiches_sample` pour rétrocompat.
   */
  public get sourceFiches(): HlkSyncFicheSample[] {
    const preview = this.previewReport ? this.previewReport.preview : null;
    if (!preview) {
      return [];
    }
    return Array.isArray(preview.fiches) ? preview.fiches : (preview.fiches_sample || []);
  }

  /**
   * Applique la recherche (id, libellé ou nom de bénéficiaire à ajouter) et
   * remet la pagination en page 1.
   */
  public applyFichesFilter(): void {
    const all = this.sourceFiches;
    const q = (this.fichesSearch || '').trim().toLowerCase();
    this.filteredFiches = !q
      ? [...all]
      : all.filter((f) => {
          const idMatch = String(f.id).includes(q);
          const labelMatch = (f.label || '').toLowerCase().includes(q);
          const benMatch = (f.beneficiaries_to_add || []).some((b) => (b || '').toLowerCase().includes(q));
          return idMatch || labelMatch || benMatch;
        });
    if (this.fichesCurrentPage) {
      this.fichesCurrentPage.setValue(1);
    }
  }

  public onFichesSearchChange(value: string): void {
    this.fichesSearch = value;
    this.applyFichesFilter();
  }

  public get fichesCurrentPage() { return this.fichesPaginationForm ? this.fichesPaginationForm.get('currentPage') : null; }
  public get fichesCurrentPageValue(): number { return this.fichesCurrentPage ? (this.fichesCurrentPage.value ?? 1) : 1; }
  public get pagedFiches(): HlkSyncFicheSample[] {
    const start = (this.fichesCurrentPageValue - 1) * this.fichesItemsPerPage;
    return this.filteredFiches.slice(start, start + this.fichesItemsPerPage);
  }

  public fichesPageChanged(event: any): void {
    if (this.fichesCurrentPage) {
      this.fichesCurrentPage.setValue(event.page);
    }
  }

  public onFichesPageSizeChange(value: string): void {
    const parsed = parseInt(value, 10);
    this.fichesItemsPerPage = isNaN(parsed) ? 25 : parsed;
    if (this.fichesCurrentPage) {
      this.fichesCurrentPage.setValue(1);
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

  public warningCount(report: HlkSyncReport | null): number {
    return report && report.warnings ? report.warnings.length : 0;
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
