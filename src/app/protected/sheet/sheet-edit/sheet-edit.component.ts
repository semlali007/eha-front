import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sheet-edit',
  templateUrl: './sheet-edit.component.html',
  styles: [
  ]
})
export class SheetEditComponent implements OnInit {

  sheetId: string | null = null;
  isReady: boolean = false;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Récupérer l'ID de la fiche depuis la route de manière synchrone d'abord
    this.sheetId = this.route.snapshot.params.id || null;
    this.isReady = true;
    
    // Puis écouter les changements de paramètres pour les navigations ultérieures
    this.route.params.subscribe(params => {
      if (params.id !== this.sheetId) {
        this.sheetId = params.id || null;
        console.log('SheetEdit: Mode édition pour la fiche (params change)', this.sheetId);
      }
    });
  }
}
