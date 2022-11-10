import { Component, OnInit, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { SearchLogService } from 'src/app/core/services/search-log.service';

@Component({
  selector: 'app-synonymous-form',
  templateUrl: './synonymous-form.component.html',
  styleUrls: ['./synonymous-form.component.css']
})
export class SynonymousFormComponent implements OnInit {

  factsheetAddForm: FormGroup;
  public afterAdd: EventEmitter<any> = new EventEmitter();
  id: number;
  get title() { return this.factsheetAddForm.get('title') }
  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private searchLogService: SearchLogService

  ) { }

  ngOnInit(): void {
    this.factsheetAddForm = this.fb.group({
      'title': ['', [
        Validators.required,
      ]],
    });
  }


  submit(): void {
    const params = {
      id: this.id,
      title: this.title.value,
    }
    console.log('params', params);

    if (!!this.id) {
      params.id = this.id;
      this.searchLogService.addSynonymous(params).subscribe(response => {
        this.bsModalRef.hide();
        this.afterAdd.emit(response);
      });
      } else {
        this.searchLogService.addSynonymous(params).subscribe(response => {
          this.bsModalRef.hide();
          this.afterAdd.emit(response);
        });
      }
  }


  

}
