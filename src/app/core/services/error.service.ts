import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from './toastr.service';
import { ModalService } from './modal.service';
import { Error } from 'src/app/shared/models/error';
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
    }
    else if(error instanceof HttpErrorResponse){
      if(error.status==504){
        this.toastrService.showToastr({
          category: 'danger',
          message: "Votre session a expiré, veuillez vous reconnecter !"
        });

        this.router.navigate(['/login']);
      }
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


}