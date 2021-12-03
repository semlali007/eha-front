import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { ToastrService } from './toastr.service';
import { ModalService } from './modal.service';
import { Error } from 'src/app/shared/models/error';
@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private toastrService: ToastrService, private modalService: ModalService) { }


  public handleError(error) {

    if (!!error && !!error.error && !!error.error.source && error.error.source == 'HLK') {
      this.modalService.showModal({
        status: error.error.status,
        message: error.error.error
      });
    } else {
      error = (typeof error === 'string') ? error : 'Une erreur est survenue, essayez plus tard.'
      this.toastrService.showToastr({
        category: 'danger',
        message: error
      });

      return throwError(error);
    }
  }

}