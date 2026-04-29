import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { invalidContractCodeValidator } from 'src/app/shared/validators/contractCodeValidator';
import { ContractService } from 'src/app/core/services/contract.service';
import * as XLSX from 'xlsx';

interface ExcelDataRow {
  code: string;
  provider: string;
  lots: string;
  contacts: string;
}
@Component({
  selector: 'app-sheet-form-contracts',
  templateUrl: './sheet-form-contracts.component.html',
  styleUrls: ['./sheet-form-contracts.component.css']
})
export class SheetFormContractsComponent implements OnInit, OnDestroy {
  @Input() contracts: FormArray;
  @Input() sheetForm: FormGroup;
  @Input() lotsList: FormControl;
  @Input() mode: 'create' | 'edit' = 'edit';
  @Input() sheetId: string | null = null;
  currentIndex: number;
  invalidContractsCount: number = 0;
  invalidContractsMessage: string = '';
  lotsListForContract: string[] = [];
  tableLot: string[] = [];
  originalFileContent: any;
  private lotsSub?: Subscription;

  constructor(private fb: FormBuilder, private contractService: ContractService) { }

  ngOnInit(): void {
    // Initialise la liste des lots disponibles à partir des lots réellement créés
    this.refreshLotsList();
    // Réagit aux ajouts/suppressions/renommages de lots dans la section "Lots"
    const lotsArray = this.sheetForm?.get('lots') as FormArray | null;
    if (lotsArray) {
      this.lotsSub = lotsArray.valueChanges.subscribe(() => this.refreshLotsList());
    }

    // Charger localStorage SEULEMENT si :
    // 1. Mode création (pas d'ID de fiche) OU  
    // 2. Mode édition mais FormArray vide (nouveau formulaire en cours)
    // MAIS JAMAIS si on édite une fiche existante (sheetId existe et FormArray a des données)
    const shouldLoadFromStorage = this.mode !== 'create' && 
                                 this.contracts.length === 0 && 
                                 !this.sheetId; // Pas d'édition de fiche existante
    
    if (shouldLoadFromStorage) {
      const savedContracts = localStorage.getItem('contracts');
      if (savedContracts) {
        try {
          const parsedContracts = JSON.parse(savedContracts);
          parsedContracts.forEach((contract: any) => {
            const contractGroup = this.fb.group({
              'code': [contract.code, [
                Validators.required,
                Validators.minLength(9),
                Validators.maxLength(10),
                Validators.pattern('^[C]{1}[a-zA-Z0-9]*$')
              ]],
              'provider': contract.provider,
              'lots': contract.lots || '',
              'contacts': contract.contacts ? contract.contacts.replace(/\r\n/g, '<br>') : '', 
            });
            this.contracts.push(contractGroup);
          });
        } catch (error) {
          console.warn('Erreur lors du chargement des contrats depuis localStorage:', error);
        }
      }
    }

    // Sauvegarder les changements dans localStorage - mais pas en mode création
    this.contracts.valueChanges.subscribe(value => {
      if (value !== null && value !== undefined && this.mode !== 'create') {
        localStorage.setItem('contracts', JSON.stringify(value));
      }
    });
  }

  onOpenClose(data: any) {
    if (data.index == this.currentIndex) {
      this.currentIndex = -1;
    } else {
      this.currentIndex = data.index;
    }
  }

  onAddedContract() {
    const contractGroup = this.fb.group({
      'code': ['', [
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(10),
        Validators.pattern('^[C]{1}[a-zA-Z0-9]*$')
      ]],
      'provider': '',
      'lots': '',
      'contacts': '',
    });

    this.contracts.push(contractGroup);
  }

  onRemovedContract(index: number) {
    this.contracts.removeAt(index);
  }

  isActive(index): boolean {
    return index == this.currentIndex;
  }

  handleFileInput(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.originalFileContent = e.target.result;
        
        const workbook = XLSX.read(e.target.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const data = XLSX.utils.sheet_to_json(worksheet, { raw: true }) as ExcelDataRow[];

        while (this.contracts.length > 0) {
          this.contracts.removeAt(0);
        }

        this.invalidContractsCount = 0;

        data.forEach((row) => {
          const contractGroup = this.fb.group({
            'code': [row.code, [
              Validators.required,
              Validators.minLength(9),
              Validators.maxLength(10),
              Validators.pattern('^[C]{1}[a-zA-Z0-9]*$')
            ]],
            'provider': row.provider,
            'lots': row.lots || '',
            'contacts': row.contacts ? row.contacts.replace(/\r\n/g, '<br>') : '',
          });
          this.contracts.push(contractGroup);

         
          if (!contractGroup.get('code').valid) {
            this.invalidContractsCount++;
          }
        });

        this.invalidContractsMessage = `Il y a ${this.invalidContractsCount} contrat(s) non valide(s).`;
      };

      reader.readAsBinaryString(file);
    }
  }
  /**
   * Recalcule la liste des noms de lots disponibles pour la dropdown
   * "Lot associé" des contrats. Source de vérité : le FormArray des lots
   * créé dans la section "Lots" juste au-dessus.
   */
  refreshLotsList(): void {
    const lotsArray = this.sheetForm?.get('lots') as FormArray | null;
    if (!lotsArray) {
      this.tableLot = [];
      this.lotsListForContract = [];
      return;
    }
    const lotNames = lotsArray.controls
      .map(ctrl => ctrl.get('name')?.value)
      .filter((name): name is string =>
        typeof name === 'string' && name.trim().length > 0,
      )
      // évite les doublons exacts
      .filter((name, idx, arr) => arr.indexOf(name) === idx);

    this.tableLot = lotNames;
    this.lotsListForContract = lotNames;
  }

  ngOnDestroy(): void {
    this.lotsSub?.unsubscribe();
  }
}
