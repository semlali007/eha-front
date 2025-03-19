import { Component, OnInit, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { HotlineEmailService } from 'src/app/core/services/hotline-email.service';
import { HotlineGroupService } from 'src/app/core/services/hotline-group.service';

@Component({
  selector: 'app-hotline-email-form',
  templateUrl: './hotline-email-form.component.html',
  styleUrls: ['./hotline-email-form.component.css']
})
export class HotlineEmailFormComponent implements OnInit {

  factsheetAddForm: FormGroup;
  public afterAdd: EventEmitter<any> = new EventEmitter();
  id: number;
  groups:any=[];
  categories: any = [];
  get group() { return this.factsheetAddForm.get('group') };
  get category() { return this.factsheetAddForm.get('category') };
  get email() { return this.factsheetAddForm.get('email') as any; };
  get living() { return this.factsheetAddForm.get('living') };
  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private hotlineEmailService: HotlineEmailService,
    private hotlineGroupService: HotlineGroupService,

  ) { }

  ngOnInit(): void {
    this.factsheetAddForm = this.fb.group({
      'email': ['', [
        Validators.required,
      ]],
      'group': ['', [
        Validators.required,
      ]],
      'category': ['', [
        Validators.required,
      ]],
      'living': false
    });
    this.hotlineGroupService.getList({}).subscribe(response => {
      this.groups = response.rows;
    })
/*    if (!!this.id) {
      this.hotlineThemeService.getElement({ id: this.id }).subscribe(response => {
        this.factsheetAddForm = this.fb.group({
          'label': [response.label, [
            Validators.required,
          ]],
          'group': [response.group, [
            Validators.required,
          ]],
          'category': [response.category, [
            Validators.required,
          ]],
          'living': response.living
        });

      })
    }*/
  }

  submit(): void {
    
    const params = {
      id: this.id,
      email: this.email.value,
      living: this.living.value,
      group: this.group.value,
      category: this.category.value
    }


    console.log('params', params);
    

    if (!!this.id) {
      params.id = this.id;
      this.hotlineEmailService.update(params).subscribe(response => {
        this.bsModalRef.hide();
        this.afterAdd.emit(response);
      });
      } else {
      
        this.hotlineEmailService.add(params).subscribe(response => {
          this.bsModalRef.hide();
          this.afterAdd.emit(response);
        });
     }
  
  }


  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.factsheetAddForm.patchValue({
        fileSource: file
      });
    }
  }
}
