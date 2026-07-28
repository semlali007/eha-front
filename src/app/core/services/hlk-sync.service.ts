import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { AppConfigService } from 'src/app/core/services/app-config.service';

/**
 * Erreur unitaire remontée par la synchronisation HLK.
 */
export interface HlkSyncError {
  contract_code?: string;
  beneficiary?: string;
  sheet_id?: number;
  message: string;
}

/**
 * Fiche présentée dans l'aperçu du mode simulation.
 */
export interface HlkSyncFicheSample {
  id: number;
  label: string;
  contracts: string[];
  beneficiaries_to_add: string[];
  nb_beneficiaries_to_add: number;
}

/**
 * Aperçu retourné uniquement en mode simulation (dry_run).
 */
export interface HlkSyncPreview {
  new_beneficiaries: string[];
  /** Liste COMPLÈTE des fiches à enrichir (champ à privilégier). */
  fiches?: HlkSyncFicheSample[];
  /**
   * Échantillon (30 fiches avec le plus d'ajouts). Conservé pour
   * rétrocompatibilité ; à retirer une fois `fiches` généralisé côté back.
   */
  fiches_sample: HlkSyncFicheSample[];
  fiches_total: number;
  unmatched_samples: string[];
}

/**
 * Fiche EHA rattachée à un contrat HLK.
 */
export interface HlkSyncMatchedSheet {
  id: number;
  label: string;
}

/**
 * Détail d'un contrat HLK unique et de ses bénéficiaires.
 */
export interface HlkSyncContractDetail {
  contract_code: string;
  nb_beneficiaries: number;
  beneficiaries: string[];
  matched_sheets: HlkSyncMatchedSheet[];
  is_matched: boolean;
}

/**
 * Bloc de détail par contrat HLK (pour vérification métier de la complétude).
 * Le tableau `contracts` est pré-trié : contrats matchés d'abord, puis par
 * `contract_code` alphabétique.
 */
export interface HlkSyncContractsDetails {
  total: number;
  matched: number;
  unmatched: number;
  contracts: HlkSyncContractDetail[];
}

/**
 * Rapport de synchronisation des bénéficiaires depuis HLK.
 * En mode simulation, `dry_run` vaut true et `preview` est renseigné.
 */
export interface HlkSyncReport {
  rows_fetched: number;
  contracts_processed: number;
  contracts_matched: number;
  contracts_unmatched: number;
  fiches_updated: number;
  links_created: number;
  beneficiaries_created: number;
  errors: HlkSyncError[];
  duration_ms: number;
  started_at: string;
  finished_at: string;
  dry_run?: boolean;
  preview?: HlkSyncPreview;
  contracts_details?: HlkSyncContractsDetails;
}

@Injectable({
  providedIn: 'root'
})
export class HlkSyncService {

  // Le traitement complet côté serveur peut être long ; on laisse une large
  // marge (1 h) avant d'abandonner côté client pour éviter une coupure
  // prématurée de la requête.
  private static readonly SYNC_TIMEOUT_MS = 3600000;

  constructor(
    private appConfigService: AppConfigService,
    private http: HttpClient,
  ) { }

  /**
   * Lance la synchronisation des bénéficiaires depuis HLK.
   * L'endpoint est synchrone : la réponse contient le rapport complet.
   * En mode simulation (`dryRun`), aucune écriture BDD n'est effectuée et la
   * réponse inclut un aperçu (`preview`) de ce qui serait fait.
   * Les erreurs ne sont volontairement pas interceptées ici afin que le
   * composant puisse les afficher tout en conservant le rapport précédent.
   */
  public syncBeneficiaries(dryRun = false): Observable<HlkSyncReport> {
    let url = `${this.appConfigService.basePath}/admin/hlk/sync-beneficiaries`;
    if (dryRun) {
      url += '?dry_run=1';
    }
    return this.http.post<HlkSyncReport>(url, {}).pipe(
      timeout(HlkSyncService.SYNC_TIMEOUT_MS)
    );
  }
}
