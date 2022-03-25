import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-purchase-form-words',
  templateUrl: './purchase-form-words.component.html',
  styleUrls: ['./purchase-form-words.component.css']
})
export class PurchaseFormWordsComponent implements OnInit {
  @Input() words: FormControl;
  
  
  ngOnInit(): void {
    console.log(this.words);
  }

}
