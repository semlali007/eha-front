import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-anchor-codes',
  templateUrl: './anchor-codes.component.html',
  styleUrls: ['./anchor-codes.component.css']
})
export class AnchorCodesComponent implements OnInit {
  codesForm: FormGroup;
  codes: any;
  sheetModalForm: FormGroup;
  closeBtnName: string;
  constructor(public bsModalRef: BsModalRef,
    private fb: FormBuilder
    ) { }
    get codeFilter() { return this.codesForm.get('codeFilter') as any; }
  ngOnInit(): void {
    this.codesForm = this.fb.group({
      'codeFilter': '',
    });
  }
}
