import { Component, OnInit } from '@angular/core';
import { DocumentationService } from 'src/app/core/services/documentation.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.css']
})
export class DocumentationComponent implements OnInit {
  documentationForm: FormGroup;
  disabledEdit : boolean = true;

  constructor(
    private documentationService: DocumentationService,
    private fb: FormBuilder,
  ) { }

  get content() { return this.documentationForm.get('content') }

  ngOnInit(): void {
     this.documentationForm = this.fb.group({
      'content': new FormControl({value: '', disabled: true}, Validators.required),
    });
    this.getDocumentation();
  }

  getDocumentation(){
    this.documentationService
    .getContent()
    .subscribe(data=>this.content.setValue(data.data));
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
}
