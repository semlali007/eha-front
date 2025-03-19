import { Component, Input, OnInit } from '@angular/core';
import { MigrationService } from 'src/app/core/services/migration.service';
@Component({
  selector: 'app-migration-dapi',
  templateUrl: './migration-dapi.component.html',
  styleUrls: ['./migration-dapi.component.css']
})
export class MigrationDapiComponent implements OnInit {
  list: any = [];
  type: string = 'dapi';
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
    this.migrationService.migrateDapi(params).subscribe(response => {
      this.getList();
    }
    )
  }

  getList() {
    this.migrationService.getList({ type: 'dapi' }).subscribe(response => {
      this.list = response;
    })
  }
}
