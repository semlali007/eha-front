import { Component, OnInit, Injectable, TemplateRef } from '@angular/core';
import {  BsModalRef } from 'ngx-bootstrap/modal';
@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-modal-info',
  templateUrl: './modal-info.component.html',
  styleUrls: ['./modal-info.component.css']
})
export class ModalInfoComponent implements OnInit {
  error: any = {};
  constructor( ) { }

  ngOnInit() {
  }

}

