import { Component, OnInit } from '@angular/core';
import { AnchorService } from 'src/app/core/services/anchor.service';
import { Anchor } from 'src/app/shared/models/anchor';
@Component({
  selector: 'app-anchor',
  templateUrl: './anchor.component.html',
  styleUrls: ['./anchor.component.css']
})
export class AnchorComponent implements OnInit {

  anchor: Anchor = new Anchor();
  filter = {};
  constructor(
    private anchorService: AnchorService,
  ) { }

  ngOnInit(): void {

  }

  onSubmittedSearchAnchor(filter) {
    this.filter = filter;
    console.log(filter);
    this.anchorService.search(filter).subscribe(data => {
      this.anchor = data;
      console.log(data);
    });
  }

}
