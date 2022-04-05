import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class PurchaseMessageService {
  private subject = new BehaviorSubject({});

  sendMessage(message: any) {
    this.subject.next(message);
  }

  getMessage(): Observable<any> {
    return this.subject;
  }
}
