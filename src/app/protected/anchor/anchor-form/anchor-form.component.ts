import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AnchorService } from 'src/app/core/services/anchor.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AnchorCodesComponent } from '../anchor-codes/anchor-codes.component';
import { MessageService } from 'src/app/core/services/message.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-anchor-form',
  templateUrl: './anchor-form.component.html',
  styles: [
  ]
})
export class AnchorFormComponent implements OnInit, OnDestroy {
  anchorForm: FormGroup;
  bsModalRef: BsModalRef;
  subscription: Subscription;
  codes: any = [];
  @Output() submittedSearchAnchor = new EventEmitter<Object>();
  zipcode: string;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private anchorService: AnchorService,
    private messageService: MessageService,
    private modalService: BsModalService
  ) { }
  get nace() { return this.anchorForm.get('nace') }
  get codeArticle() { return this.anchorForm.get('codeArticle') as any; }

  ngOnInit(): void {
    this.createAnchorForm();
    this.subscription = this.messageService.getMessage().subscribe((searchData) => {
      if (!!searchData && !!searchData.type && (searchData.type == 'zip_code')) {
        this.zipcode = searchData.searchText;
        this.submit();
      }

      if (!!searchData && !!searchData.type && (searchData.type == 'anchor-code')) {
        const selected = [];
        searchData.selected.forEach(code=>
          {
            selected.push({'display':code, 'value': code});
          }
      
        )
        this.nace.setValue(selected);
      }
    });
    this.anchorService.getCodes().subscribe(codes => {
      this.codes = codes;
    });  
    
  }

  createAnchorForm(): FormGroup {
    return this.anchorForm = this.fb.group({
      'nace': '',
      'codeArticle': '',
    });
  }

  submit() {
    let filter: any = {};
    if (this.zipcode.length > 0) {
      filter.zipcode = this.zipcode;
    }
    
    filter.nace = [];
    if (!!this.nace.value && this.nace.value.length > 0) {

      const selected = [];
      (this.nace.value || []).forEach(item=>
        {
          selected.push(item.value);
        }
        );
        
      filter.nace = selected;
    }
    if (this.codeArticle.value.length > 0) {
      filter.articles = this.codeArticle.value;
    }

    this.submittedSearchAnchor.emit(filter);
  }
  openModalCodes() {
    this.anchorService.getCodes().subscribe(codes => {
      const selected = [];
      (this.nace.value || []).forEach(item=>
        {
          selected.push(item.value);
        }
        );

      const initialState = {
        codes: codes,
        selected: selected
      };

      this.bsModalRef = this.modalService.show(AnchorCodesComponent, { initialState });
      this.bsModalRef.content.closeBtnName = 'Fermer';
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
   }

   resetForm(){
    this.anchorForm.reset();
    this.submit();
   }
}
