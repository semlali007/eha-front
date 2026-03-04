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
      if (!Array.isArray(data)) {
        return;
      }

      let d = data.filter(t => t.id == this.id);
      if (d.length === 0) {
        return;
      }

      // Extraire uniquement les propriétés attendues (whitelist)
      this.description = typeof d[0].description === 'string' ? d[0].description : '';
      this.warning = typeof d[0].warning === 'string' ? d[0].warning : '';

      data.filter(s => s.parent == this.id).forEach(element => {
        // Créer une copie propre avec uniquement les propriétés attendues
        this.section.push(this.sanitizeDocItem(element));
      });

      let ItemParentId: number = this.id;
      let position = 1;
      while (ItemParentId !== 0) {
        data.filter(s => s.id == ItemParentId).forEach(element => {
          // Créer une copie propre au lieu de muter l'objet API
          const sanitizedElement = this.sanitizeDocItem(element);
          sanitizedElement.position = position;
          position++;
          this.parents.unshift(sanitizedElement);
          ItemParentId = typeof element.parent === 'number' ? element.parent : 0;
        });
      }
    })
  }

  /**
   * Extrait uniquement les propriétés attendues d'un objet documentation.
   * Protection contre le Prototype Pollution en créant un objet propre
   * sans copier de propriétés dangereuses (__proto__, constructor, prototype).
   */
  private sanitizeDocItem(item: any): any {
    const allowedKeys = [
      'id', 'parent', 'label', 'description', 'warning',
      'breadcrumb', 'link', 'position', 'order', 'active'
    ];
    const clean: any = {};
    for (const key of allowedKeys) {
      if (item.hasOwnProperty(key) && !this.isDangerousKey(key)) {
        clean[key] = item[key];
      }
    }
    return clean;
  }

  /**
   * Vérifie si une clé de propriété est dangereuse (Prototype Pollution).
   */
  private isDangerousKey(key: string): boolean {
    return ['__proto__', 'constructor', 'prototype'].includes(key);
  }

}
