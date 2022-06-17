import { Component, Input, OnInit } from '@angular/core';
import { MigrationService } from 'src/app/core/services/migration.service';
@Component({
  selector: 'app-migration-datp',
  templateUrl: './migration-datp.component.html',
  styleUrls: ['./migration-datp.component.css']
})
export class MigrationDatpComponent implements OnInit {
  list: any = [];
  typeFirst: string = 'datpa';
  typeSecond: string = 'datpb';
  type: string = 'datp';
  constructor(
    private migrationService: MigrationService,
  ) { }
  ngOnInit(): void {
    this.getList();
  }

  onSubmittedFormFirst(params) {
    this.migrationService
      .uploadData(params)
      .subscribe(
        response => {
          this.getList();
        }
      );
  }


  onSubmittedFormSecond(params) {
    this.migrationService
      .uploadData(params)
      .subscribe(
        response => {
          this.getList();
        }
      );
  }


  onSubmittedMigration(params) {
    this.migrationService.migrateDatp(params).subscribe(response => {
      this.getList();
    }
    )
  }

  getList() {
    this.migrationService.getList({ type: 'datp' }).subscribe(response => {
      this.list = response;
    })
  }
}
