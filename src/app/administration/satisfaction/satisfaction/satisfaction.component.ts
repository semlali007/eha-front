import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SatisfactionService } from 'src/app/core/services/satisfaction.service';
import { ExcelService } from 'src/app/core/services/excel.service';

interface Rating {
  level: 'low' | 'medium' | 'high' | 'top' | 'na';
  label: string;
}

@Component({
  selector: 'app-satisfaction',
  templateUrl: './satisfaction.component.html',
  styleUrls: ['./satisfaction.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SatisfactionComponent implements OnInit, OnDestroy {
  all: any[] = [];
  filtered: any[] = [];
  paged: any[] = [];
  searchText: string = '';
  itemsPerPage: number = 10;
  paginationForm: FormGroup;
  startIndex: number = 0;
  endIndex: number = 10;
  private sub?: Subscription;

  private readonly RATING_MAP: Record<string, Rating> = {
    not_expected: { level: 'low', label: '★ Pas attendu' },
    complicated:  { level: 'medium', label: '★★ Compliqué' },
    good_job:     { level: 'high', label: '★★★ Bon travail' },
    special:      { level: 'top', label: '★★★★ Mention spéciale' },
  };

  constructor(
    private satisfactionService: SatisfactionService,
    private excelService: ExcelService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.paginationForm = this.fb.group({ currentPage: 1 });
    this.loadData();
  }

  get currentPage() { return this.paginationForm.get('currentPage'); }

  loadData() {
    this.sub = this.satisfactionService.getList().subscribe((response: any[]) => {
      this.all = response || [];
      this.applyFilter();
    });
  }

  onSearchChange(value: string) {
    this.searchText = value;
    this.currentPage.setValue(1);
    this.applyFilter();
  }

  private applyFilter() {
    const q = (this.searchText || '').trim().toLowerCase();
    this.filtered = !q
      ? [...this.all]
      : this.all.filter(item =>
          [item.cockpit_id, item.da_pgi, item.nni]
            .some(v => (v ?? '').toString().toLowerCase().includes(q))
        );
    this.updatePaged();
  }

  pageChanged(event: any): void {
    this.startIndex = (event.page - 1) * event.itemsPerPage;
    this.endIndex = Math.min(event.page * event.itemsPerPage, this.filtered.length);
    this.currentPage.setValue(event.page);
    this.updatePaged();
  }

  private updatePaged() {
    const page = this.currentPage?.value || 1;
    this.startIndex = (page - 1) * this.itemsPerPage;
    this.endIndex = Math.min(this.startIndex + this.itemsPerPage, this.filtered.length);
    this.paged = this.filtered.slice(this.startIndex, this.endIndex);
  }

  ratingLabel(value: string): Rating {
    return this.RATING_MAP[value] ?? { level: 'na', label: '—' };
  }

  download(type: string) {
    const purchases = this.filtered.map(data => ({
      created_at: data.created_at,
      cockpit_id: data.cockpit_id,
      da_pgi: data.da_pgi,
      nni: data.nni,
      contractual: data.contractual,
      timing: data.timing,
      strong_points: data.strong_points,
      accompaniement: data.accompaniement,
      improvement: data.improvement,
    }));

    if (type === 'csv') {
      this.excelService.exportToCsv(purchases, 'enquête de satisfaction.csv', [
        'created_at', 'cockpit_id', 'da_pgi', 'nni', 'contractual', 'timing',
        'strong_points', 'accompaniement', 'improvement',
      ]);
    }

    if (type === 'excel') {
      this.excelService.generateExcel({
        header: [
          'Date', 'Cockpit', 'PGI', 'NNI',
          "Avez-vous le sentiment d'avoir bien été accompagné par la DAG sur ce dossier?",
          'Les clauses contractuelles validées sont-elles pertinentes ?',
          'Le marché a-t-il été mis à disposition au bon moment ?',
          "Quels sont les points forts à souligner (notre collaboration, nos conseils en amont de la consultation, la connaissance du segment, les initiatives en matières de RSE, d'innovation, etc...)",
          "Avez-vous des axes d'amélioration à nous soumettre ?",
        ],
        data: purchases,
      }, { sheet: 'DA', name: 'enquête de satisfaction.xlsx' });
    }

    if (type === 'json') {
      this.excelService.exportToJson(purchases, 'enquête de satisfaction.json');
    }
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }
}
