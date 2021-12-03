import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Error } from 'src/app/shared/models/error';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private error: BehaviorSubject<any> = new BehaviorSubject(null);
  public readonly error$: Observable<Error | null> = this.error.asObservable();

  constructor() { }

  public showModal(error: Error): void {
    this.error.next(error);
  }

  public closeModal() {
    this.error.next(null);
  }
}