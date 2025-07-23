
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

import { AreaService } from 'src/app/core/services/area.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SheetFormModalComponent } from '../sheet-form-modal/sheet-form-modal.component';
import { Area } from 'src/app/shared/models/area';

@Component({
  selector: 'app-sheet-form-areas',
  templateUrl: './sheet-form-areas.component.html',
  styleUrls: ['./sheet-form-areas.component.css']
})
export class SheetFormAreasComponent implements OnInit {

  @Input() areas: FormControl;
  @Input() sheetForm: FormGroup;
  @Input() allareas: [];
  @Input() mode: 'create' | 'edit' = 'edit'; // Nouveau: mode passé par le parent
  
  availableAreas: Area[] = [];
  isLoading: boolean = false;
  
  private page: number;
  private items: Area[];
  private total: number;
  bsModalRef: BsModalRef;
  itemsPerPage: number;
  constructor(
    private fb: FormBuilder,
    private areaService: AreaService,
    private modalService: BsModalService
  ) {
  }

  ngOnInit() {
    this.page = 1;
    this.items = [];
    this.total = 0;
    this.itemsPerPage = 5;
    
    // Charger toutes les zones disponibles puis initialiser la valeur
    this.loadAllAreas();
  }

  private loadAllAreas(): void {
    this.isLoading = true;
    // Charger toutes les zones d'un coup (pagination élevée pour tout récupérer)
    this.areaService.getList({ page: 1, perPage: 1000 }).subscribe({
      next: (data) => {
        // Le backend retourne maintenant directement le format {code, label}
        this.availableAreas = data.data || [];
        this.isLoading = false;
        
        // Initialiser la valeur APRÈS le chargement des zones disponibles
        this.initializeSelectedArea();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des zones:', error);
        this.isLoading = false;
      }
    });
  }

  private initializeSelectedArea(): void {
    // 1. Vérifier s'il y a déjà une valeur dans le FormControl (mode modification)
    const currentValue = this.areas.value;
    if (currentValue && currentValue.code && currentValue.label) {
      
      // Vérifier si cette valeur existe dans les zones disponibles (comparaison flexible sur les types)
      const matchingArea = this.availableAreas.find(area => String(area.code) === String(currentValue.code));
      if (matchingArea) {
        // Utiliser l'objet de la liste disponible pour assurer la correspondance
        this.areas.setValue(matchingArea);
      } else {
        console.warn('Zone non trouvée dans la liste disponible:', currentValue);
        // Optionnel : garder la valeur existante même si elle n'est pas dans la liste
        // this.areas.setValue(currentValue);
      }
      
      this.setupValueChangeListener();
      return;
    }

    // 2. Sinon, vérifier le localStorage (nouveau formulaire) - mais pas en mode création
    if (this.mode !== 'create') {
      const savedAreas = localStorage.getItem('areas');
      if (savedAreas) {
        try {
          const parsed = JSON.parse(savedAreas);
          // Gérer la migration depuis l'ancien format array vers sélection unique
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Prendre le premier élément si c'était un array
            const firstArea = parsed[0];
            const matchingArea = this.availableAreas.find(area => area.code === firstArea.code);
            if (matchingArea) {
              this.areas.setValue(matchingArea);
            }
          } else if (parsed && !Array.isArray(parsed)) {
            // Déjà un objet unique
            const matchingArea = this.availableAreas.find(area => area.code === parsed.code);
            if (matchingArea) {
              this.areas.setValue(matchingArea);
            }
          }
        } catch (e) {
          console.warn('Erreur lors du parsing localStorage areas:', e);
        }
      }
    }

    this.setupValueChangeListener();
  }

  private setupValueChangeListener(): void {
    // Sauvegarder les changements dans localStorage - mais pas en mode création
    this.areas.valueChanges.subscribe(value => {
      if (this.mode !== 'create') {
        localStorage.setItem('areas', JSON.stringify(value));
      }
    });
  }

  /**
   * Fonction de comparaison pour le select Angular
   * Permet de comparer les objets Area par leur code (flexible sur les types)
   */
  compareAreas = (area1: any, area2: any): boolean => {
    if (!area1 || !area2) return false;
    // Convertir les deux codes en string pour la comparaison
    return String(area1.code) === String(area2.code);
  }

  // Méthode conservée pour compatibilité mais peut être supprimée si modal supprimée
  public requestAutocompleteItems = (text: string): Observable<any> => {
    return this.areaService.requestAutocompleteItems(text);
  }

  // Méthode optionnelle - peut être supprimée si on ne veut plus de modal
  openModalWithComponent() {
    console.warn('Modal désactivée - utilisez la liste déroulante');
    // Modal désactivée pour le mode liste déroulante
    return;
    
    /* Code original conservé en commentaire pour référence future
    this.areaService.getList({ page: this.page, perPage: this.itemsPerPage }).subscribe(data => {
      // Le backend retourne maintenant directement le format {code, label}
      this.items = data.data || [];
      this.total = data.total;
      let selected = [];

      if (!!this.areas.value) 
        {
          // Adaptation pour sélection unique
          if (Array.isArray(this.areas.value)) {
            this.areas.value.forEach(element => {
              selected.push(element);
            });
          } else {
            selected.push(this.areas.value);
          }
        }
      

      const initialState = {
        type:'area',
        items: this.items,
        total: this.total,
        title: 'Zones',
        selectedValues: selected,
        itemsPerPage: this.itemsPerPage,
        placeholder: 'Entrer une zone',
        maxSize: 6,
        allitems: this.allareas,
        requestAutocompleteItems: this.requestAutocompleteItems,
      };

      this.bsModalRef = this.modalService.show(SheetFormModalComponent, { initialState });
      this.bsModalRef.content.event.subscribe(res => {
        // Adaptation pour sélection unique
        const selectedValue = Array.isArray(res.data.value) ? res.data.value[0] : res.data.value;
        this.areas.setValue(selectedValue);
      });

      this.bsModalRef.content.addElementEvent.subscribe(res => {
        this.areaService.add(new Area({ label: res.data.value })).subscribe(t =>
          this.areaService.getList({ page: this.page, perPage: this.itemsPerPage }).subscribe(data => {
            this.bsModalRef.content.items = data.data || [];
            this.bsModalRef.content.total = data.total;
          })
        );
      });

      this.bsModalRef.content.eventPaginate.subscribe(res => {
        this.areaService.getList({
          page: res.data.page,
          perPage: this.itemsPerPage
        }).subscribe(data => {
          this.bsModalRef.content.items = data.data || [];
          this.bsModalRef.content.total = data.total;
        })
      });
    });
    */
  }
}
