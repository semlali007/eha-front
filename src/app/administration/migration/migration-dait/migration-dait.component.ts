import { Component, Input, OnInit } from '@angular/core';
import { MigrationService } from 'src/app/core/services/migration.service';
@Component({
  selector: 'app-migration-dait',
  templateUrl: './migration-dait.component.html',
  styleUrls: ['./migration-dait.component.css']
})
export class MigrationDaitComponent implements OnInit {
  list: any = [];
  type: string = 'dait';
  constructor(
    private migrationService: MigrationService,
  ) { }
  ngOnInit(): void {
    this.getList();
  }

  onSubmittedForm(params) {
    this.migrationService
      .uploadData(params)
      .subscribe(
        response => {
          this.getList();
        }
      );
  }

  onSubmittedMigration(params) {
    this.migrationService.migrateDait(params).subscribe(response => {
      this.getList();
    }
    )
  }

  getList() {
    this.migrationService.getList({ type: 'dait' }).subscribe(response => {
      this.list = response;
    })
  }
}
