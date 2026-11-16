import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/core/services/message.service';

@Component({
  selector: 'app-hotline-add',
  templateUrl: './hotline-add.component.html',
  styleUrls: ['./hotline-add.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class HotlineAddComponent implements OnInit {
  message: string = '';

  constructor(
    private messageService: MessageService,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  onloadedResponse(message: string) {
    this.message = message;
  }

  reload() {
    this.message = '';
    this.messageService.sendMessage({ hotlineForm: 'reload' });
  }

  showList() {
    this.router.navigate(['app/hotline/list']);
  }
}
