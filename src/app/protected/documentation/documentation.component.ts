import { Component, OnInit } from '@angular/core';
import { DocumentationService } from 'src/app/core/services/documentation.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.css']
})
export class DocumentationComponent implements OnInit {
  id: number = 0;
  section: any = [];
  parents: any = [];
  warning: string = '';
  description: string = '';
  myDocumentation: any = null;
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
    this.parents = [];
    this.documentationService.getDocumentation({ cache: 'cache' }).subscribe(data => {
      let d = data.filter(t => t.id == this.id);
      this.description = d[0].description;
      this.warning = d[0].warning;

      data.filter(s => s.parent == this.id).forEach(element => {
        this.section.push(element);
      });
      let ItemParentId: number = this.id;
      let position = 1;
      while (ItemParentId !== 0) {
        let item = data.filter(s => s.id == ItemParentId).forEach(element => {
          element.position = position;
          position++;
          this.parents.unshift(element);
          ItemParentId = element.parent;
        });
      }
    })
  }

}
