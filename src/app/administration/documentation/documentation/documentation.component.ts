import { Component, OnInit } from '@angular/core';
import { DocumentationService } from 'src/app/core/services/documentation.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DocumentationAddComponent } from '../documentation-add/documentation-add.component';
@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.css']
})
export class DocumentationComponent implements OnInit {
  documentationForm: FormGroup;
  disabledEdit : boolean = true;
  bsModalRef: BsModalRef;
  id: number = 0;
  items: any = [];
  constructor(
    private documentationService: DocumentationService,
    private fb: FormBuilder,
    private modalService: BsModalService
  ) { }

  get content() { return this.documentationForm.get('content') }

  ngOnInit(): void {
     this.documentationForm = this.fb.group({
      'content': new FormControl({value: '', disabled: true}, Validators.required),
    });
    this.getDocumentation();
  }

  getDocumentation() {
    this.documentationService
      .getDetails({
        id: this.id
      })
      .subscribe(data => this.items = data.items);
  }

  
  submit() {
    this.documentationService
    .update({content:this.content.value})
    .subscribe(response=>{
      this.getDocumentation();
      this.content.disable();
    });
  }

  activate() {
    this.content.enable();
  }



  openAdd() {
    const initialState = {
      id: this.id
    };

    this.bsModalRef = this.modalService.show(DocumentationAddComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Fermer';
    this.bsModalRef.content.afterAdd.subscribe(response => {
      this.getDocumentation();
    });
  }
}
