import { Component, OnInit } from '@angular/core';

import { User } from 'src/app/shared/models/user';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-sheet-edit',
  templateUrl: './sheet-edit.component.html',
  styles: [
  ]
})
export class SheetEditComponent implements OnInit {
  public user: User;
  data:any={};
  list: [];
  public numberOfNotifications: number = 0;
  constructor(private notificationService: NotificationService) { 
    
  }

  ngOnInit(): void {
    this.refreshNotifications0();
  }

  private refreshNotifications0() {
    this.notificationService.getUserNotification({ nni: this.user.nni }).subscribe(data => {
      this.list = data;
      if (Array.isArray(data)) {
        this.numberOfNotifications = data.length;
        console.log('Nombre de notifications:', this.numberOfNotifications);
      } else {
        this.numberOfNotifications = 0; 
      }
    });
  }

}
