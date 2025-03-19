import { Component, OnInit } from '@angular/core';
import { FactsheetService } from 'src/app/core/services/factsheet.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.css']
})
export class MediaComponent implements OnInit {
  id: number = 0;
  section: any = [];
  parents: any = [];
  warning: string = '';
  description: string = '';
  myDocumentation: any = null;
  doc: string = '';
  constructor(
    private route: ActivatedRoute,
    private factsheetService: FactsheetService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (!!params.id) {
        this.id = params.id;
        this.loadDocumentation();
      }
    });
  }

  loadDocumentation() {
    this.factsheetService.getDocument({ id: this.id }).subscribe((response: any) => {
      let blob: any = new Blob([response]);
      var fileURL: any = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = fileURL;
      this.doc = fileURL;
    })
  }

}
