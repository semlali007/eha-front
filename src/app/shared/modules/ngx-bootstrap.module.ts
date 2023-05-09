import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertModule } from 'ngx-bootstrap/alert';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ButtonsModule } from 'ngx-bootstrap/buttons';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AlertModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    PopoverModule.forRoot(),
    PaginationModule.forRoot(),
    TabsModule.forRoot(),
    ProgressbarModule.forRoot(),
    AccordionModule.forRoot(),
    CollapseModule.forRoot(),
    TypeaheadModule.forRoot(),
    TooltipModule.forRoot(),
    ButtonsModule.forRoot(),
  ],
  exports: [
    AlertModule,
    TypeaheadModule,
    BsDatepickerModule,
    BsDropdownModule,
    ModalModule,
    PopoverModule,
    PaginationModule,
    TabsModule,
    ProgressbarModule,
    AccordionModule,
    CollapseModule,
    TooltipModule,
    ButtonsModule
   ]
})
export class NgxBootstrapModule { }
