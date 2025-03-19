import { Component, OnInit, Input } from '@angular/core';
import { Observable} from 'rxjs';
@Component({
  selector: 'app-purchase-situation-list-item-body',
  templateUrl: './purchase-situation-list-item-body.component.html',
  styleUrls: ['./purchase-situation-list-item-body.component.css']
})
export class PurchaseSituationListItemBodyComponent implements OnInit {
  @Input() purchase: any;
  @Input() purchase$: Observable<any>;

  status:any={
    '1':{
      'icon':'icon-initilaisee',
      'img':'polygon-first',
      'label':'Initialisée'
    },
    '2':{
      'icon':'icone-transmise-pha',
      'img':'polygon-first',
      'label':'Transmise PHA'
    },
    '3':{
      'icon':'icone-soumise-au-manager',
      'img':'polygon-first',
      'label':'Soumise au manager'
    },
    '4':{
      'icon':'icone-affecter-a-lachteur',
      'img':'polygon-first',
      'label':"Affectée à l'acheteur"
    },
    '5':{
      'icon':'icon-integre-en-affaire',
      'img':'polygon-first',
      'label':'Intégrée en affaire'
    },
    '6':{
      'icon':'icon-refuse',
      'img':'polygon-first',
      'label':'Refusée'
    }
  }
  constructor() {
  }
  ngOnInit() {
    
  }
}