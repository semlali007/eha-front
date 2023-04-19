import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';
import { SatisfactionService } from 'src/app/core/services/satisfaction.service';
import { ExcelService } from 'src/app/core/services/excel.service';

@Component({
  selector: 'app-satisfaction',
  templateUrl: './satisfaction.component.html',
  styleUrls: ['./satisfaction.component.css']
})
export class SatisfactionComponent implements OnInit {
  satisfactions$: Observable<any>;
  constructor(
    private satisfactionService: SatisfactionService,
    private excelService: ExcelService,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.satisfactions$ = this.satisfactionService.getList();
  }

  download() {
    this.satisfactions$.subscribe((response: any) => {
      const purchases: any = [];
      response.forEach(data => {
        purchases.push({
          created_at: data.created_at,
          cockpit_id: data.cockpit_id,
          da_pgi: data.da_pgi,
          nni: data.nni,
          contractual: data.contractual,
          timing: data.timing,
          strong_points: data.strong_points,
          accompaniement: data.accompaniement,
          improvement: data.improvement,  
        });
      });

      this.excelService.generateExcel({header:[
        "Date",'Cockpit', 'PGI', 'NNI', "Avez-vous le sentiment d'avoir bien été accompagné par la DAG sur ce dossier?", "Les clauses contractuelles validées sont-elles pertinentes ?",
        "Le marché a-t-il été mis à disposition au bon moment ?", "Quels sont les points forts à souligner (notre collaboration, nos conseils en amont de la consultation, la connaissance du segment, les initiatives en matières de RSE, d'innovation, etc...)", "Avez-vous des axes d'amélioration à nous soumettre ?"
      ],data:purchases}, { sheet: 'DA', name: "enquête de satisfaction.xlsx" });
    });
  }

}
