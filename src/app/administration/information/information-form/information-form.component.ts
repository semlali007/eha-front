import { Component, OnInit, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InformationService } from 'src/app/core/services/information.service';

@Component({
  selector: 'app-information-form',
  templateUrl: './information-form.component.html',
  styleUrls: ['./information-form.component.css']
})
export class InformationFormComponent implements OnInit {

  informationAddForm: FormGroup;
  public afterAdd: EventEmitter<any> = new EventEmitter();
  id: number;
  get short_description() { return this.informationAddForm.get('short_description') }
  get long_description() { return this.informationAddForm.get('long_description') }
  get start_date() { return this.informationAddForm.get('start_date') }
  get end_date() { return this.informationAddForm.get('end_date') }

  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private informationService: InformationService

  ) { }

  ngOnInit(): void {
    this.informationAddForm = this.fb.group({
      'short_description': ['', [
        Validators.required,
      ]],
      'long_description': ['', [
        Validators.required,
      ]],
      'start_date': ['', [
        Validators.required,
      ]],
      'end_date': ['', [
        Validators.required,
      ]],
    });
    if (!!this.id) {
      this.informationService.getElement({ id: this.id }).subscribe(response => {
        this.short_description.setValue(response.short_description);
        this.long_description.setValue(response.long_description);
        this.start_date.setValue(new Date(response.start_date));
        this.end_date.setValue(new Date(response.end_date));
      })
    }
  }

  submit() {
    let params = {
      'short_description': this.short_description.value,
      'long_description': this.long_description.value,
      'start_date': this.start_date.value,
      'end_date': this.end_date.value,
      'id': null,
    }
      if (!!this.id) {
      params.id = this.id;
      this.informationService.updateInformation(params).subscribe(response => {
        this.bsModalRef.hide();
        this.afterAdd.emit(response);
      });
      } else {
        this.informationService.addInformation('home_page', params).subscribe(response => {
          this.bsModalRef.hide();
          this.afterAdd.emit(response);
        });
      }
  
  }
}
