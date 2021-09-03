import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-hotline-list-items',
  templateUrl: './hotline-list-items.component.html',
  styles: [
  ]
})
export class HotlineListItemsComponent implements OnInit {
  @Input() items: [] = [];
  constructor(private router: Router,) { }
  ngOnInit(): void {
    
  }

  showHotline(hotline:any){
    let params = ['app/hotline/get', hotline.id];

    if(!!hotline.sha && hotline.sha.length > 0){
      params.push(hotline.sha);
    }

    this.router.navigate(params);
  }
}
