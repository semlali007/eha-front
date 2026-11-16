import { Component, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { DocumentationService } from 'src/app/core/services/documentation.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DocumentationFormComponent } from '../documentation-form/documentation-form.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ExcelService } from 'src/app/core/services/excel.service';

@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: [
    './documentation.component.css',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class DocumentationComponent implements OnInit {
  public fileForm!: FormGroup;
  public requestData: any;
  public bsModalRef?: BsModalRef;
  public bsConfirmModalRef?: BsModalRef;
  public id: number = 0;
  private idToDelete?: number;
  public items: any[] = [];
  public parents: any[] = [];
  public title: string = '';
  public breadcrumb: string = '';
  public hasOrderChanges = false;

  constructor(
    private documentationService: DocumentationService,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private router: Router,
    private excelService: ExcelService,
  ) {}

  get file() { return this.fileForm.get('file'); }

  ngOnInit(): void {
    this.fileForm = this.fb.group({
      file: new FormControl('', [Validators.required]),
      fileSource: new FormControl('', [Validators.required]),
    });

    this.route.params.subscribe(params => {
      this.id = !!params['id'] ? +params['id'] : 0;
      this.getDocumentation();
    });
  }

  getDocumentation(): void {
    this.documentationService.getDetails({ id: this.id }).subscribe(data => {
      this.items = data.items || [];
      this.parents = (data.parents || []).slice().reverse();
      this.title = data.label || '';
      this.breadcrumb = data.breadcrumb || '';
      this.hasOrderChanges = false;
    });
  }

  openAdd(id?: number): void {
    const initialState = { parentId: id };
    this.bsModalRef = this.modalService.show(DocumentationFormComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Fermer';
    this.bsModalRef.content.afterAdd.subscribe(() => this.getDocumentation());
  }

  openEdit(id?: number): void {
    const initialState = { documentationId: id };
    this.bsModalRef = this.modalService.show(DocumentationFormComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Fermer';
    this.bsModalRef.content.afterAdd.subscribe(() => this.getDocumentation());
  }

  remove(id: number): void {
    this.documentationService.remove({ id }).subscribe(() => this.getDocumentation());
  }

  showSubItems(targetId: number): void {
    this.router.navigate([`admin/documentation/${targetId}`]);
  }

  // Drag & drop
  private draggedIndex!: number;
  public draggedOverIndex!: number;

  allowDrop(event: DragEvent, index: number): void {
    this.draggedOverIndex = index;
    event.preventDefault();
  }

  onDragStart(index: number): void {
    this.draggedIndex = index;
  }

  onDrop(event: DragEvent, index: number): void {
    event.preventDefault();
    const item = this.items[this.draggedIndex];
    this.items.splice(this.draggedIndex, 1);
    this.items.splice(index, 0, item);
    this.draggedIndex = -1;
    this.draggedOverIndex = -1;
    this.hasOrderChanges = true;
  }

  saveChange(): void {
    const sortedList: any[] = [];
    let position = 0;
    this.items.forEach(element => {
      position++;
      element.position = position;
      sortedList.push(element);
    });
    this.documentationService.updatePositions({ items: sortedList }).subscribe(() => this.getDocumentation());
  }

  import(){
    // Clés interdites pour prévenir toute Prototype/Object Property Pollution
    // via un fichier CSV importé qui contiendrait ces en-têtes.
    const FORBIDDEN_KEYS = ['__proto__', 'constructor', 'prototype'];
    let params = [];
    this.requestData.forEach((DataValue,DataKey)=>{
      if(DataKey == 0){
        return;
      }
      // Objet sans prototype → aucune propriété ne peut être "héritée" ni polluée
      let line = Object.create(null);
      this.requestData[0].forEach((value,key)  => {
        if (typeof value !== 'string' || FORBIDDEN_KEYS.includes(value)) {
          return;
        }
        line[value] = DataValue[key];
      });
      params.push(line);
    });

    this.documentationService.import({
      fields: this.requestData.length > 0 ? this.requestData[0] : [],
      data: params,
    }).subscribe(() => this.getDocumentation());
  }

  export(): void {
    this.documentationService.export().subscribe(data => {
      this.excelService.generateExcel(data, { sheet: 'documentations', name: 'export_documentations' });
    });
  }

  onFileChange(event: any): void {
    const promise = new Promise((resolve) => {
      const data = this.excelService.readExcel(event);
      resolve(data);
    });
    promise.then(response => {
      this.requestData = response;
      if (event.target.files.length > 0) {
        const file = event.target.files[0];
        this.fileForm.patchValue({ fileSource: file });
      }
    });
  }

  openModal(template: TemplateRef<any>, id: number): void {
    this.bsConfirmModalRef = this.modalService.show(template, { class: 'modal-sm' });
    this.idToDelete = id;
  }

  confirm(): void {
    if (this.idToDelete == null) return;
    this.remove(this.idToDelete);
    this.bsConfirmModalRef?.hide();
  }

  decline(): void {
    this.bsConfirmModalRef?.hide();
  }
}
