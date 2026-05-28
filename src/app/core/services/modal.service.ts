import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Error } from 'src/app/shared/models/error';
import { ErrorDetail } from 'src/app/shared/models/error-detail';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private error: BehaviorSubject<any> = new BehaviorSubject(null);
  public readonly error$: Observable<Error | null> = this.error.asObservable();

  private errorDetail: BehaviorSubject<ErrorDetail | null> = new BehaviorSubject<ErrorDetail | null>(null);
  public readonly errorDetail$: Observable<ErrorDetail | null> = this.errorDetail.asObservable();

  constructor() { }

  public showModal(error: Error): void {
    this.error.next(error);
  }

  public closeModal() {
    this.error.next(null);
  }

  public showErrorDetail(detail: ErrorDetail): void {
    this.errorDetail.next(detail);
  }

  public closeErrorDetail(): void {
    this.errorDetail.next(null);
  }
}