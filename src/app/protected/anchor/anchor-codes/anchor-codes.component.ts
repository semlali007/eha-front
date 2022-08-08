import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MessageService } from 'src/app/core/services/message.service';
@Component({
  selector: 'app-anchor-codes',
  templateUrl: './anchor-codes.component.html',
  styleUrls: ['./anchor-codes.component.css']
})
export class AnchorCodesComponent implements OnInit {
  codesForm: FormGroup;
  codes: any;
  selected: any;
  sheetModalForm: FormGroup;
  closeBtnName: string;
  constructor(public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private messageService: MessageService,
    ) { }
    get codeFilter() { return this.codesForm.get('codeFilter') as any; }
  ngOnInit(): void {
    this.codesForm = this.fb.group({
      'codeFilter': '',
    });
  }

  addToList(item){
    this.selected.push(item[0]);
    this.notifyParentPage();
  }

  removeItemFromList(item){
    this.selected.forEach((element,index) => {
      if (element == item[0]) {
        this.selected.splice(index, 1);
      }
    });
    this.notifyParentPage();
  }

  notifyParentPage(){
    this.messageService.sendMessage({
      type: 'anchor-code',
      selected: this.selected
    });
  }

  isSelected(item){
    return this.selected.indexOf(item[0])>=0;
  }
}
