import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { ToastrService } from './toastr.service';
@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private toastrService: ToastrService) { }


  public handleError(error) {
  
    if(!!error && !!error.error && !!error.error.source && error.error.source == 'HLK'){
      return throwError(error);
    }

    error = (typeof error === 'string')?error:'Une erreur est survenue, essayez plus tard.'
    this.toastrService.showToastr({
      category: 'danger',
      message: error
    });
    return throwError(error);
  }

}