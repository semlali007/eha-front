import { Component, OnInit, TemplateRef } from '@angular/core';
import { DocumentationService } from 'src/app/core/services/documentation.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DocumentationFormComponent } from '../documentation-form/documentation-form.component';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.css']
})
export class DocumentationComponent implements OnInit {
  documentationForm: FormGroup;
  disabledEdit : boolean = true;
  bsModalRef?: BsModalRef;
  bsConfirmModalRef?: BsModalRef;
  id: number = 0;
  idToDelete?: number;
  items: any = [];
  parents: any = [];
  title: string = '';
  breadcrumb: string = '';
  changePosition: false;
  constructor(
    private documentationService: DocumentationService,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  get content() { return this.documentationForm.get('content') }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (!!params.id) {
        this.id = params.id;
        this.getDocumentation();
      }
    });
  }

  getDocumentation() {
    this.documentationService
      .getDetails({
        id: this.id
      })
      .subscribe(data => {
        this.items = data.items;
        this.parents = data.parents.reverse();
        this.title = data.label;
        this.breadcrumb = data.breadcrumb;
      });
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

  openAdd(id?: number) {
    const initialState = {
      parentId: id,
    };

    this.bsModalRef = this.modalService.show(DocumentationFormComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Fermer';
    this.bsModalRef.content.afterAdd.subscribe(response => {
      this.getDocumentation();
    });
  }


  openEdit(id?: number) {
    const initialState = {
      documentationId: id,
    };

    this.bsModalRef = this.modalService.show(DocumentationFormComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Fermer';
    this.bsModalRef.content.afterAdd.subscribe(response => {
      this.getDocumentation();
    });
  }

  remove($id) {
    
    this.documentationService
      .remove({
        id: $id
      })
      .subscribe(data => this.getDocumentation());
  }

  showSubItems($id){
    this.router.navigate([`admin/documentation/${$id}`]);
  }


  private draggedIndex: number;
  public draggedOverIndex: number;

  allowDrop($event, index): void {
    this.draggedOverIndex = index;
    $event.preventDefault();
  }

  onDragStart(index): void {
    this.draggedIndex = index;
  }

  onDrop($event, index): void {
    $event.preventDefault();
    const item = this.items[this.draggedIndex];
    this.items.splice(this.draggedIndex, 1);
    this.items.splice(index, 0, item);
    this.draggedIndex = -1;
    this.draggedOverIndex = -1;
  }
 
  saveChange(){
    let sortedList = [];
    let position: number = 0;
    this.items.forEach(element => {
      position++;
      element.position = position;
      sortedList.push(element);
    });

    this.documentationService
    .updatePositions({items:sortedList})
    .subscribe(response=>{
      this.getDocumentation();
    });
  }

  openModal(template: TemplateRef<any>, id: number) {
    this.bsConfirmModalRef = this.modalService.show(template, {class: 'modal-sm'});
    this.idToDelete = id;
  }
 
  confirm(): void {
    this.remove(this.idToDelete);
    this.bsConfirmModalRef?.hide();
    
  }
 
  decline(): void {
    this.bsConfirmModalRef?.hide();
  }
}
