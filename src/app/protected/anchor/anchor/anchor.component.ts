import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AnchorService } from 'src/app/core/services/anchor.service';
import { Anchor } from 'src/app/shared/models/anchor';
@Component({
  selector: 'app-anchor',
  templateUrl: './anchor.component.html',
  styleUrls: ['./anchor.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AnchorComponent implements OnInit {
  itemsPerPage: any = 10;

  anchor: Anchor = new Anchor();
  filter = {};
  constructor(
    private anchorService: AnchorService,
  ) { }

  ngOnInit(): void {

  }


  onSubmittedSearchAnchor(filter: any) {
    this.filter = filter;
    this.anchorService.search(filter).subscribe(data => {
      this.anchor = data;
    });
  }

  changePerPage(number: number) {
    this.itemsPerPage = number;
  }
}
