import { Component, OnInit, Input } from '@angular/core';
import { Observable} from 'rxjs';
@Component({
  selector: 'app-purchases-list-item-body',
  templateUrl: './purchases-list-item-body.component.html',
  styleUrls: ['./purchases-list-item-body.component.css']
})
export class PurchaseListItemBodyComponent implements OnInit {
  @Input() purchase: any;
  @Input() purchase$: Observable<any>;

  status:any={
    '1':{
      'icon':'icon-cree',
      'img':'polygon-first',
      'label':'Créee'
    },
    '2':{
      'icon':'icone-valide',
      'img':'polygon-first',
      'label':'Validée'
    },
    '3':{
      'icon':'icon-transmise',
      'img':'polygon-first',
      'label':'Transmise'
    },
    '4':{
      'icon':'icone-valide',
      'img':'polygon-first',
      'label':'Transmise'
    },
    '5':{
      'icon':'icon-en-instruction',
      'img':'polygon-first',
      'label':'En instruction'
    }
  }
  constructor() {
  }
  ngOnInit() {
    
  }
}