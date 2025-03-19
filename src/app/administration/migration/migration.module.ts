import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MigrationComponent } from './migration/migration.component';
import { MigrationRoutingModule } from './migration-routing.module'
import { MigrationDapiComponent } from './migration-dapi/migration-dapi.component';
import { MigrationDaitComponent } from './migration-dait/migration-dait.component';
import { MigrationDatpComponent } from './migration-datp/migration-datp.component';
import { MigrationFileComponent } from './migration-file/migration-file.component';
import { MigrationListComponent } from './migration-list/migration-list.component';

@NgModule({
  declarations: [
    MigrationComponent, 
    MigrationDapiComponent, 
    MigrationDaitComponent, 
    MigrationDatpComponent, 
    MigrationFileComponent,
    MigrationListComponent
  ],
  imports: [
    SharedModule,
    MigrationRoutingModule
  ]
})
export class MigrationModule { }
