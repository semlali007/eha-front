import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/core/services/message.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-hotline-add',
  templateUrl: './hotline-add.component.html',
  styles: [
  ]
})
export class HotlineAddComponent implements OnInit {
  message: string = '';
  constructor(
    private messageService: MessageService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }


  onloadedResponse(message) {
    this.message = message;
  }

  reload() {
    this.messageService.sendMessage({
      hotlineForm: 'reload'
    });
  }

  showList() {
    this.router.navigate(['app/hotline/list']);
  }

}
