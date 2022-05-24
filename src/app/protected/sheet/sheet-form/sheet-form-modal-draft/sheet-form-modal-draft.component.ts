import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SheetService } from 'src/app/core/services/sheet.service';

@Component({
  selector: 'app-sheet-form-modal-draft',
  templateUrl: './sheet-form-modal-draft.component.html',
  styleUrls: ['./sheet-form-modal-draft.component.css']
})
export class SheetFormModalDraftComponent implements OnInit {

  constructor(private router: Router,
    private sheetService: SheetService,
    public bsModalRef: BsModalRef,) { }

  ngOnInit(): void {
  }

  confirm(): void {
    if(!!localStorage.getItem('draftId'))
    {
      this.bsModalRef.hide();
      this.router.navigate([`app/fiches/modification/${localStorage.getItem('draftId')}`]).then( response => this.sheetService.redirectToDraft()).catch(error => this.sheetService.redirectToDraft(error));
    }
  }
 
  decline(): void {
    this.sheetService.remove({id:localStorage.getItem('draftId')}).subscribe(response => {
      localStorage.removeItem('draftId');
      this.bsModalRef.hide()});
  }
}
