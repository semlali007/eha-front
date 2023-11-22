import { Injectable } from '@angular/core';
import { Subject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationDeletedService {

  private notificationDeletedSource = new Subject<void>();

  notificationDeleted$: Observable<void> = this.notificationDeletedSource.asObservable();

  emitNotificationDeleted(): void {
    this.notificationDeletedSource.next();
  }
}