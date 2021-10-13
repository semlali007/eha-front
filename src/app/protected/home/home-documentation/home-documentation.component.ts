import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DocumentationService } from 'src/app/core/services/documentation.service';

@Component({
  selector: 'app-home-documentation',
  templateUrl: './home-documentation.component.html',
  styleUrls: ['./home-documentation.component.css']
})
export class HomeDocumentationComponent implements OnInit {
  subscription: Subscription;
  section: any = [];
  constructor(
    private router: Router,
    private documentationService: DocumentationService,

  ) { }

  ngOnInit(): void {
    this.loadDocumentation();
  }

  /*navigate(url) {
    this.router.navigate(
      [url]
    );
  }*/

  navigate(doc: any) {
    if (doc.link == '#' || doc.link.length == 0) {
      this.router.navigate(
        [`app/documentation/${doc.id}`]
      );
    } else if (doc.link.includes('http') == true) {
      window.open(doc.link, '_blank');
    } else if (doc.link.includes('mailto') == true) {
      window.open(doc.link, '_self');
    } else {
      this.router.navigate(
        [doc.link]
      );
    }
  }


  loadDocumentation() {
    this.section = [];
    this.documentationService.getDocumentation({ cache: 'cache' }).subscribe(data => {
      data.filter(s => s.parent == 0).forEach(element => {
        console.log(element);
        this.section.push(element);
      });
    })
  }

}
