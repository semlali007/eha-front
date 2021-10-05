import { Component,  EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DocumentationService } from 'src/app/core/services/documentation.service';
@Component({
  selector: 'app-documentation-add',
  templateUrl: './documentation-add.component.html',
  styles: [
  ]
})
export class DocumentationAddComponent implements OnInit {
  id: number = 0;
  actualEmail: string = '';
  editForm: FormGroup;
  public afterAdd: EventEmitter<any> = new EventEmitter();
  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private documentationService: DocumentationService,
  ) { }

  get title() { return this.editForm.get('title') }
  get url() { return this.editForm.get('url') }
  get external() { return this.editForm.get('external') }
  get description() { return this.editForm.get('description') }
  get warning() { return this.editForm.get('warning') }
  get breadcrumb() { return this.editForm.get('breadcrumb') }


  ngOnInit(): void {
    this.editForm = this.fb.group({
      'title': ['', [
        Validators.required,
      ]],
      'external': false,
      'url': '',
      'description': '',
      'warning': '',
      'breadcrumb': '',

    });
  }

  submit(): void {
    const params = {
      id: this.id,
      title : this.title.value,
      external : this.external.value,
      url : this.url.value,
      description : this.description.value,
      warning : this.warning.value,
      breadcrumb : this.breadcrumb.value,
    }
    this.documentationService.add(params).subscribe(response => {
      this.bsModalRef.hide();
      this.afterAdd.emit(response);
    })
  }
}
