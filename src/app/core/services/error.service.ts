import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from './toastr.service';
import { ModalService } from './modal.service';
@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  constructor(private router: Router,private toastrService: ToastrService, private modalService: ModalService) { }
  public handleError(error) {

    if (!!error && !!error.error && !!error.error.source && error.error.source == 'HLK') {
      this.modalService.showModal({
        status: error.error.status,
        message: error.error.error
      });
      return throwError(error);
    }
    else if(error instanceof HttpErrorResponse){
      if(error.status==504){
        this.toastrService.showToastr({
          category: 'danger',
          message: "Votre session a expiré, veuillez vous reconnecter !"
        });
        return throwError(error);
      }

      this.dispatchHttpError(error);
      return throwError(error);
    }
    else {
      error = (typeof error === 'string') ? error : 'Une erreur est survenue, essayez plus tard.'
      this.toastrService.showToastr({
        category: 'danger',
        message: error
      });

      return throwError(error);
    }
  }

  private dispatchHttpError(error: HttpErrorResponse): void {
    const rawBody = this.extractRawBody(error);

    if (rawBody) {
      const wafMatch = rawBody.match(/Support ID is:\s*(\d+)/i);
      if (wafMatch || /requested URL was rejected/i.test(rawBody)) {
        this.modalService.showErrorDetail({
          title: 'Requête bloquée par le pare-feu',
          message: "Votre requête a été bloquée par le pare-feu applicatif. Communiquez le Support ID ci-dessous à un administrateur pour débloquer la situation.",
          supportId: wafMatch ? wafMatch[1] : undefined,
          rawBody: this.cleanAndTruncate(rawBody, 2000),
          httpStatus: error.status,
        });
        return;
      }
      if (/Maximum execution time/i.test(rawBody)) {
        this.modalService.showErrorDetail({
          title: "L'opération a pris trop de temps",
          message: "Le serveur a interrompu l'opération car elle dépassait le temps maximum autorisé. Ajoutez des filtres (période, statut, contrat groupe…) pour réduire le volume de données à traiter.",
          rawBody: this.cleanAndTruncate(rawBody, 2000),
          httpStatus: error.status,
        });
        return;
      }
      if (/Fatal error/i.test(rawBody)) {
        this.modalService.showErrorDetail({
          title: 'Erreur serveur',
          message: "Une erreur PHP est survenue côté serveur. Vous pouvez transmettre les détails techniques ci-dessous au support.",
          rawBody: this.cleanAndTruncate(rawBody, 2000),
          httpStatus: error.status,
        });
        return;
      }
      this.modalService.showErrorDetail({
        title: 'Réponse serveur inattendue',
        message: "Le serveur a renvoyé un contenu non reconnu. Transmettez les détails ci-dessous au support pour diagnostic.",
        rawBody: this.cleanAndTruncate(rawBody, 2000),
        httpStatus: error.status,
      });
      return;
    }

    if (error.error && typeof error.error === 'object' && typeof error.error.message === 'string') {
      this.toastrService.showToastr({
        category: 'danger',
        message: error.error.message
      });
      return;
    }

    if (error.status === 0) {
      this.toastrService.showToastr({
        category: 'danger',
        message: "Le serveur est injoignable. Vérifiez votre connexion réseau."
      });
      return;
    }

    this.toastrService.showToastr({
      category: 'danger',
      message: `Une erreur est survenue (HTTP ${error.status}). Réessayez ou contactez le support.`
    });
  }

  private extractRawBody(error: HttpErrorResponse): string | null {
    // Cas typique : Angular HttpClient n'a pas réussi à parser le JSON
    // → error.error = { error: SyntaxError, text: '<corps brut>' }
    if (error.error && typeof error.error === 'object' && typeof error.error.text === 'string' && error.error.text.length > 0) {
      return error.error.text;
    }
    if (typeof error.error === 'string' && error.error.length > 0) {
      return error.error;
    }
    return null;
  }

  private cleanAndTruncate(s: string, max: number): string {
    const cleaned = s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return cleaned.length > max ? cleaned.slice(0, max) + '…' : cleaned;
  }
}