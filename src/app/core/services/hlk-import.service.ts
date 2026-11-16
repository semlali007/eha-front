import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { timeout, map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppConfigService } from 'src/app/core/services/app-config.service';

export type HlkRunStatus = 'running' | 'success' | 'partial' | 'error';

/** Compteurs d'un run (tous optionnels : vides pour un run en cours). */
export interface HlkRunStats {
  rows_fetched?: number;
  rows_eligible?: number;
  rows_ineligible?: number;
  sheets_aggregated?: number;
  created?: number;
  skipped_existing?: number;
  skipped_by_achat_id?: number;
  skipped_by_contract?: number;
  category_usage?: { [key: string]: any };
  [key: string]: any;
}

export interface HlkSyncRun {
  id: number;
  job_name?: string;
  started_at: string;
  finished_at: string | null;
  duration_ms: number | null;
  status: HlkRunStatus;
  triggered_by: string;
  dry_run?: boolean;
  signed_since_used?: string;
  next_cursor?: string;
  stats: HlkRunStats;
}

export interface HlkRunError {
  achat_id_cockpit?: number;
  message: string;
}

export interface HlkRunWarning {
  code?: string;
  message: string;
  pages_skipped?: number[];
  total_pages_hlk?: number;
  coverage_ratio?: number;
}

export interface HlkCreatedSheet {
  id: number;
  label: string;
  status: number;
  draft?: boolean;
  achat_id_cockpit?: number;
  netachat_type?: string;
  created_at?: string;
  updated_at?: string;
  created_by_full_name?: string;
  acheteur?: string;
}

export interface HlkRunDetail extends HlkSyncRun {
  errors?: HlkRunError[];
  warnings?: HlkRunWarning[];
  created_sheet_ids?: number[];
  created_sheets?: HlkCreatedSheet[];
}

export interface HlkRunsResponse {
  job_name: string;
  total: number;
  limit: number;
  offset: number;
  runs: HlkSyncRun[];
}

export interface HlkCreatedSheetsResponse {
  total: number;
  limit: number;
  offset: number;
  from?: string;
  to?: string;
  sheets: HlkCreatedSheet[];
}

/** Rapport complet retourné (de façon synchrone) par le trigger. */
export interface HlkImportReport {
  status: 'success' | 'partial' | 'error';
  dry_run: boolean;
  signed_since?: string;
  next_cursor?: string;
  sync_run_id?: number;
  pages_processed?: number;
  rows_fetched?: number;
  rows_eligible?: number;
  rows_ineligible?: number;
  sheets_aggregated?: number;
  created?: number;
  skipped_existing?: number;
  skipped_by_achat_id?: number;
  skipped_by_contract?: number;
  errors?: HlkRunError[];
  warnings?: HlkRunWarning[];
  duration_ms?: number;
  started_at?: string;
  finished_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class HlkImportService {

  // Le batch tourne plusieurs minutes ; large marge (30 min) avant d'abandonner côté client.
  private static readonly TRIGGER_TIMEOUT_MS = 1800000;

  constructor(
    private appConfigService: AppConfigService,
    private http: HttpClient,
  ) { }

  private get base(): string {
    return `${this.appConfigService.basePath}/admin/hlk`;
  }

  /** Liste paginée des runs du batch d'import de fiches. */
  public getRuns(limit = 50, offset = 0, includeDryRuns = false): Observable<HlkRunsResponse> {
    const params = new HttpParams()
      .set('limit', String(limit))
      .set('offset', String(offset))
      .set('include_dry_runs', String(includeDryRuns));
    return this.http.get<HlkRunsResponse>(`${this.base}/sync-runs`, { params });
  }

  /** Détail d'un run (stats, erreurs, warnings, fiches créées). */
  public getRun(id: number): Observable<HlkRunDetail> {
    return this.http.get<HlkRunDetail>(`${this.base}/sync-runs/${id}`);
  }

  /** Fiches auto-créées sur une période (from / to au format YYYY-MM-DD, to inclusif). */
  public getCreatedSheets(from?: string, to?: string, limit = 50, offset = 0): Observable<HlkCreatedSheetsResponse> {
    let params = new HttpParams()
      .set('limit', String(limit))
      .set('offset', String(offset));
    if (from) {
      params = params.set('from', from);
    }
    if (to) {
      params = params.set('to', to);
    }
    return this.http.get<HlkCreatedSheetsResponse>(`${this.base}/created-sheets`, { params });
  }

  /**
   * Déclenche le batch de façon SYNCHRONE : la requête reste ouverte 5 à 10 min
   * (keepalive côté serveur) puis renvoie le rapport complet. Timeout client 10 min.
   * @param signedSince optionnel (YYYY-MM-DD) — sinon le back utilise son curseur courant.
   * @param dryRun optionnel — simulation sans écriture.
   */
  public triggerImport(signedSince?: string, dryRun = false): Observable<HlkImportReport> {
    const body: { signed_since?: string; dry_run?: boolean } = {};
    if (signedSince) {
      body.signed_since = signedSince;
    }
    if (dryRun) {
      body.dry_run = true;
    }
    // Réponse en 'text' : le back envoie des espaces keepalive puis le JSON en fin de flux.
    // Le parse auto d'Angular échouerait (« erreur » sur un 200) → on parse nous-mêmes.
    return this.http.post(`${this.base}/import-sheets/trigger`, body, { responseType: 'text' }).pipe(
      timeout(HlkImportService.TRIGGER_TIMEOUT_MS),
      map((text: string) => this.parseReport(text))
    );
  }

  /** Parse le corps texte (espaces keepalive de tête/queue ignorés). */
  private parseReport(text: string): HlkImportReport {
    const trimmed = (text || '').trim();
    try {
      return JSON.parse(trimmed) as HlkImportReport;
    } catch (e) {
      // Repli : extraire le bloc JSON s'il reste du bruit autour.
      const start = trimmed.indexOf('{');
      const end = trimmed.lastIndexOf('}');
      if (start >= 0 && end > start) {
        return JSON.parse(trimmed.slice(start, end + 1)) as HlkImportReport;
      }
      throw new Error('La réponse du serveur est illisible (JSON introuvable).');
    }
  }
}
