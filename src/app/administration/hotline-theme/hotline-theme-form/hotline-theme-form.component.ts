import { Component, OnInit, EventEmitter, ViewEncapsulation } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HotlineThemeService } from 'src/app/core/services/hotline-theme.service';

@Component({
  selector: 'app-hotline-theme-form',
  templateUrl: './hotline-theme-form.component.html',
  styleUrls: [
    './hotline-theme-form.component.css',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class HotlineThemeFormComponent implements OnInit {

  factsheetAddForm!: FormGroup;
  public afterAdd: EventEmitter<any> = new EventEmitter();
  id!: number;

  get label() { return this.factsheetAddForm.get('label'); }
  get living() { return this.factsheetAddForm.get('living'); }

  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private hotlineThemeService: HotlineThemeService,
  ) {}

  ngOnInit(): void {
    this.factsheetAddForm = this.fb.group({
      label: ['', [Validators.required]],
      living: [false],
    });
    if (!!this.id) {
      this.hotlineThemeService.getElement({ id: this.id }).subscribe(response => {
        this.factsheetAddForm = this.fb.group({
          label: [response.label, [Validators.required]],
          living: [!!response.living],
        });
      });
    }
  }

  submit(): void {
    const params: any = {
      id: this.id,
      label: this.label?.value,
      living: this.living?.value,
    };
    if (!!this.id) {
      params.id = this.id;
      this.hotlineThemeService.update(params).subscribe(response => {
        this.bsModalRef.hide();
        this.afterAdd.emit(response);
      });
    } else {
      this.hotlineThemeService.add(params).subscribe(response => {
        this.bsModalRef.hide();
        this.afterAdd.emit(response);
      });
    }
  }
}
