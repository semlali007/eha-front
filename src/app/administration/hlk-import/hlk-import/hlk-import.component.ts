import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { TimeoutError } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {
  HlkImportService,
  HlkSyncRun,
  HlkRunDetail,
  HlkRunStatus,
  HlkCreatedSheet,
  HlkImportReport,
} from 'src/app/core/services/hlk-import.service';
import { ToastrService } from 'src/app/core/services/toastr.service';
import { Status } from 'src/app/shared/models/status';
import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeFr, 'fr');

@Component({
  selector: 'app-hlk-import',
  templateUrl: './hlk-import.component.html',
  styleUrls: ['./hlk-import.component.css']
})
export class HlkImportComponent implements OnInit, OnDestroy {

  // Poll léger de l'historique tant qu'un run est visible en 'running'.
  private static readonly RUNNING_POLL_MS = 30000;

  // --- Zone 1 : déclenchement (synchrone) ---
  public loading = false;
  public triggerResult: HlkImportReport | null = null;
  public triggerError: string | null = null;
  public triggerDate = '';
  public triggerDryRun = false;
  private pendingSignedSince: string | undefined = undefined;
  private pendingDryRun = false;

  // --- Zone 2 : historique des runs ---
  public runs: HlkSyncRun[] = [];
  public runsTotal = 0;
  public runsLimit = 50;
  public runsOffset = 0;
  public includeDryRuns = false;
  public runsLoading = false;
  public runsError: string | null = null;

  // --- Zone 3 : fiches auto-créées ---
  public createdSheets: HlkCreatedSheet[] = [];
  public csTotal = 0;
  public csLimit = 50;
  public csOffset = 0;
  public csFrom = '';
  public csTo = '';
  public csLoading = false;
  public csError: string | null = null;

  // --- Modales ---
  public confirmModalRef?: BsModalRef;
  public dateModalRef?: BsModalRef;
  public runDetailModalRef?: BsModalRef;
  public selectedRun: HlkRunDetail | null = null;
  public runDetailLoading = false;

  private runningPollTimer: any = null;
  private status = new Status();

  constructor(
    private hlkImportService: HlkImportService,
    private modalService: BsModalService,
    private toastrService: ToastrService,
  ) { }

  ngOnInit(): void {
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);
    const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    this.triggerDate = this.toISODate(weekAgo);
    this.csFrom = this.toISODate(firstOfMonth);
    this.csTo = this.toISODate(today);

    this.loadRuns();
    this.loadCreatedSheets();
  }

  ngOnDestroy(): void {
    this.stopRunningPoll();
    this.setUnloadGuard(false);
  }

  // ================= Zone 1 : déclenchement =================

  /** "Relancer maintenant" → confirmation puis trigger avec body vide. */
  public askTriggerNow(template: TemplateRef<any>): void {
    if (this.loading) {
      return;
    }
    this.pendingSignedSince = undefined;
    this.pendingDryRun = false;
    this.confirmModalRef = this.modalService.show(template, { class: 'modal-md' });
  }

  public confirmTriggerNow(): void {
    this.confirmModalRef?.hide();
    this.doTrigger(this.pendingSignedSince, this.pendingDryRun);
  }

  public declineTrigger(): void {
    this.confirmModalRef?.hide();
  }

  /** "Relancer depuis une date" → modale avec date + dry-run. */
  public openDateModal(template: TemplateRef<any>): void {
    if (this.loading) {
      return;
    }
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    this.triggerDate = this.toISODate(weekAgo);
    this.triggerDryRun = false;
    this.dateModalRef = this.modalService.show(template, { class: 'modal-md' });
  }

  public confirmTriggerFromDate(): void {
    this.dateModalRef?.hide();
    this.doTrigger(this.triggerDate || undefined, this.triggerDryRun);
  }

  public cancelDateModal(): void {
    this.dateModalRef?.hide();
  }

  private doTrigger(signedSince: string | undefined, dryRun: boolean): void {
    if (this.loading) {
      return;
    }
    this.loading = true;
    this.triggerResult = null;
    this.triggerError = null;
    this.setUnloadGuard(true);

    this.hlkImportService.triggerImport(signedSince, dryRun).subscribe(
      (report: HlkImportReport) => {
        this.loading = false;
        this.setUnloadGuard(false);
        this.triggerResult = report;
        const created = report.created || 0;
        const warns = report.warnings ? report.warnings.length : 0;
        this.toastrService.showToastr({
          category: report.status === 'error' ? 'danger' : 'success',
          message: `Batch terminé — ${created} fiche(s) créée(s)`
            + (warns > 0 ? `, ${warns} warning(s)` : '') + '.'
        });
        // Rafraîchit l'historique et les fiches créées pour refléter le nouveau run.
        this.runsOffset = 0;
        this.loadRuns();
        this.loadCreatedSheets();
      },
      (err: any) => {
        this.loading = false;
        this.setUnloadGuard(false);
        this.triggerError = this.buildTriggerError(err);
        // Le batch a pu s'exécuter partiellement côté serveur : on rafraîchit quand même.
        this.loadRuns();
      }
    );
  }

  /** Empêche la fermeture accidentelle de l'onglet pendant l'exécution. */
  private setUnloadGuard(active: boolean): void {
    if (active) {
      window.onbeforeunload = () => 'Un batch est en cours. Quitter la page risque de l\'interrompre.';
    } else {
      window.onbeforeunload = null;
    }
  }

  public dismissTriggerResult(): void {
    this.triggerResult = null;
    this.triggerError = null;
  }

  // ================= Zone 2 : runs =================

  public loadRuns(silent = false): void {
    if (!silent) {
      this.runsLoading = true;
    }
    this.runsError = null;
    this.hlkImportService.getRuns(this.runsLimit, this.runsOffset, this.includeDryRuns).subscribe(
      (res) => {
        this.runs = res.runs || [];
        this.runsTotal = res.total || 0;
        this.runsLoading = false;
        this.syncRunningPoll();
      },
      (err) => {
        if (!silent) {
          this.runsError = this.buildErrorMessage(err);
        }
        this.runsLoading = false;
      }
    );
  }

  public refreshRuns(): void {
    this.loadRuns();
  }

  public toggleIncludeDryRuns(value: boolean): void {
    this.includeDryRuns = value;
    this.runsOffset = 0;
    this.loadRuns();
  }

  public get runsPage(): number {
    return Math.floor(this.runsOffset / this.runsLimit) + 1;
  }

  public get runsPageCount(): number {
    return Math.max(1, Math.ceil(this.runsTotal / this.runsLimit));
  }

  public runsPrev(): void {
    if (this.runsOffset <= 0) {
      return;
    }
    this.runsOffset = Math.max(0, this.runsOffset - this.runsLimit);
    this.loadRuns();
  }

  public runsNext(): void {
    if (this.runsOffset + this.runsLimit >= this.runsTotal) {
      return;
    }
    this.runsOffset += this.runsLimit;
    this.loadRuns();
  }

  public hasRunningRun(): boolean {
    return this.runs.some((r) => r.status === 'running');
  }

  // Poll léger (30 s) uniquement tant qu'un run 'running' est visible.
  private syncRunningPoll(): void {
    if (this.hasRunningRun() && !this.runningPollTimer) {
      this.runningPollTimer = window.setInterval(() => this.loadRuns(true), HlkImportComponent.RUNNING_POLL_MS);
    } else if (!this.hasRunningRun() && this.runningPollTimer) {
      this.stopRunningPoll();
    }
  }

  private stopRunningPoll(): void {
    if (this.runningPollTimer) {
      window.clearInterval(this.runningPollTimer);
      this.runningPollTimer = null;
    }
  }

  // ================= Détail d'un run =================

  public openRunDetail(run: HlkSyncRun, template: TemplateRef<any>): void {
    this.selectedRun = null;
    this.runDetailLoading = true;
    this.runDetailModalRef = this.modalService.show(template, { class: 'modal-lg' });
    this.hlkImportService.getRun(run.id).subscribe(
      (detail) => {
        this.selectedRun = detail;
        this.runDetailLoading = false;
      },
      (err) => {
        this.runDetailLoading = false;
        this.toastrService.showToastr({ category: 'danger', message: this.buildErrorMessage(err) });
        this.runDetailModalRef?.hide();
      }
    );
  }

  public closeRunDetail(): void {
    this.runDetailModalRef?.hide();
    this.selectedRun = null;
  }

  // ================= Zone 3 : fiches auto-créées =================

  public loadCreatedSheets(): void {
    this.csLoading = true;
    this.csError = null;
    this.hlkImportService.getCreatedSheets(this.csFrom || undefined, this.csTo || undefined, this.csLimit, this.csOffset).subscribe(
      (res) => {
        this.createdSheets = res.sheets || [];
        this.csTotal = res.total || 0;
        this.csLoading = false;
      },
      (err) => {
        this.csError = this.buildErrorMessage(err);
        this.csLoading = false;
      }
    );
  }

  public applyCreatedSheetsFilter(): void {
    this.csOffset = 0;
    this.loadCreatedSheets();
  }

  public get csPage(): number {
    return Math.floor(this.csOffset / this.csLimit) + 1;
  }

  public get csPageCount(): number {
    return Math.max(1, Math.ceil(this.csTotal / this.csLimit));
  }

  public csPrev(): void {
    if (this.csOffset <= 0) {
      return;
    }
    this.csOffset = Math.max(0, this.csOffset - this.csLimit);
    this.loadCreatedSheets();
  }

  public csNext(): void {
    if (this.csOffset + this.csLimit >= this.csTotal) {
      return;
    }
    this.csOffset += this.csLimit;
    this.loadCreatedSheets();
  }

  // ================= Helpers d'affichage =================

  public statusLabel(status: HlkRunStatus | string): string {
    switch (status) {
      case 'running': return 'En cours';
      case 'success': return 'Réussi';
      case 'partial': return 'Partiel';
      case 'error': return 'Échec';
      default: return (status as string) || '—';
    }
  }

  public statusClass(status: HlkRunStatus | string): string {
    switch (status) {
      case 'running': return 'running';
      case 'success': return 'success';
      case 'partial': return 'partial';
      case 'error': return 'error';
      default: return 'muted';
    }
  }

  public triggeredByKind(triggeredBy: string): string {
    if (!triggeredBy) { return 'muted'; }
    if (triggeredBy.startsWith('admin')) { return 'admin'; }
    if (triggeredBy === 'cron') { return 'cron'; }
    if (triggeredBy === 'cli') { return 'cli'; }
    if (triggeredBy === 'webhook') { return 'webhook'; }
    return 'muted';
  }

  public sheetStatusLabel(code: number): string {
    return new Status({ code }).getCode() || '—';
  }

  public formatDuration(ms: number | null | undefined): string {
    if (ms === null || ms === undefined || isNaN(ms)) {
      return '—';
    }
    const totalSeconds = Math.round(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return minutes > 0 ? `${minutes} min ${seconds} s` : `${seconds} s`;
  }

  public editSheetLink(id: number): any[] {
    return ['/app/fiches/modification', id];
  }

  // ================= Interne =================

  private toISODate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  private buildTriggerError(error: any): string {
    if (error instanceof TimeoutError || (error && error.name === 'TimeoutError')) {
      return "Le délai d'attente (30 min) a été dépassé : le batch a été interrompu. "
        + "Consultez l'historique et relancez si nécessaire.";
    }
    if (error instanceof HttpErrorResponse) {
      if (error.status === 504 || error.status === 0) {
        return 'La connexion au serveur a été interrompue avant la fin du batch, '
          + "qui s'est donc arrêté. Consultez l'historique et relancez si nécessaire.";
      }
    }
    return 'Le batch a échoué : ' + this.buildErrorMessage(error);
  }

  private buildErrorMessage(error: any): string {
    if (error && error.error && typeof error.error === 'object') {
      if (typeof error.error.error === 'string') { return error.error.error; }
      if (typeof error.error.message === 'string') { return error.error.message; }
    }
    if (error && typeof error.status === 'number') {
      return `Une erreur est survenue (HTTP ${error.status}).`;
    }
    return 'Une erreur est survenue. Réessayez plus tard.';
  }
}
