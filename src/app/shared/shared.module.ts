import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxBootstrapModule } from './modules/ngx-bootstrap.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TinymceModule } from './modules/tinymce.module';
import { DragAndDropModule } from './modules/drag-and-drop.module';
import { TagsModule } from './modules/tags.module';
import { FileManagerModule } from './modules/file-manager.module';
import { PipesModule } from './modules/pipes.module';
import { ViewerModule } from './modules/viewer.module';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { ApiService } from './api.service';
@NgModule({
  declarations: [SidenavComponent, BreadcrumbComponent],
  imports: [
    CommonModule,
    NgxBootstrapModule,
    ReactiveFormsModule,
    TinymceModule,
    TagsModule,
    DragAndDropModule,
    FileManagerModule,
    PipesModule,
    ViewerModule
  ],
  exports: [
    CommonModule,
    NgxBootstrapModule,
    ReactiveFormsModule,
    TinymceModule,
    TagsModule,
    DragAndDropModule,
    FileManagerModule,
    PipesModule,
    SidenavComponent,
    BreadcrumbComponent,
    ViewerModule
  ],
  providers: [
    ApiService,
  ]
})
export class SharedModule { }
