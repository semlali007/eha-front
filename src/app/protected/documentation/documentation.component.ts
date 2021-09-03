import { Component, OnInit } from '@angular/core';
import { DocumentationService } from 'src/app/core/services/documentation.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.css']
})
export class DocumentationComponent implements OnInit {
  id: string = '';
  section: any;
  myDocumentation: any = '';
  constructor(
    private route: ActivatedRoute,
    private documentationService: DocumentationService,
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

  navigate(link: string) {
    if (link.includes('http') == true) {
      window.open(link, '_blank');
    } else if (link.includes('mailto') == true) {
      window.open(link, '_self');
    }
    else {
      this.router.navigate(
        [link]
      );
    }
  }

  loadDocumentation() {
    this.documentationService.getDocumentation({cache:'cache'}).subscribe(data => {
      this.section = data[this.id];
    })
  }
}
