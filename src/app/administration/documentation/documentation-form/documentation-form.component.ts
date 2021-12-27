import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DocumentationService } from 'src/app/core/services/documentation.service';
@Component({
  selector: 'app-documentation-form',
  templateUrl: './documentation-form.component.html',
  styles: [
  ]
})
export class DocumentationFormComponent implements OnInit {

  documentationId: number;
  parentId: number;
  documentationForm: FormGroup;
  public afterAdd: EventEmitter<any> = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    public bsModalRef: BsModalRef,
    private documentationService: DocumentationService,
  ) { }

  get title() { return this.documentationForm.get('title') }
  get url() { return this.documentationForm.get('url') }
  get shortdescription() { return this.documentationForm.get('shortdescription') }
  get external() { return this.documentationForm.get('external') }
  get description() { return this.documentationForm.get('description') }
  get warning() { return this.documentationForm.get('warning') }
  get breadcrumb() { return this.documentationForm.get('breadcrumb') }

  ngOnInit(): void {
    this.documentationForm = this.fb.group({
      'title': ['', [
        Validators.required,
      ]],
      'shortdescription': '',
      'external': false,
      'url': '',
      'description': '',
      'warning': '',
      'breadcrumb': ['', [
        Validators.required,
      ]],
    });
    if (this.documentationId) {
      this.documentationService.getDetails({ id: this.documentationId }).subscribe(response => {
        this.title.setValue(response.label);
        this.shortdescription.setValue(response.shortdescription);
        this.external.setValue(response.external);
        this.url.setValue(response.link);
        this.warning.setValue(response.warning);
        this.description.setValue(response.description);
        this.breadcrumb.setValue(response.breadcrumb);
      })
    }
  }

  submit(): void {
    const params = {
      parent: this.parentId,
      label: this.title.value,
      shortdescription: this.shortdescription.value,
      external: this.external.value,
      link: this.url.value,
      description: this.description.value,
      warning: this.warning.value,
      breadcrumb: this.breadcrumb.value,
      id: this.documentationId
    }

    if (this.documentationId) {
      this.documentationService.update(params).subscribe(response => {
        this.bsModalRef.hide();
        this.afterAdd.emit(response);
      })
    }
    else {
      this.documentationService.add(params).subscribe(response => {
        this.bsModalRef.hide();
        this.afterAdd.emit(response);
      })
    }
  }
}
