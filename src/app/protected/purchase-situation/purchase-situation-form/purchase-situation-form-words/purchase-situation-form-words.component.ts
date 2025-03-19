import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-purchase-situation-form-words',
  templateUrl: './purchase-situation-form-words.component.html',
  styleUrls: ['./purchase-situation-form-words.component.css']
})
export class PurchaseSituationFormWordsComponent implements OnInit {
  @Input() words: FormControl;
  
  ngOnInit(): void {
  }

}
