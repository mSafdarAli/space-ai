import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PropertiesRoutingModule } from './properties-routing.module';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { FormControllerModule } from '../shared/form-controller/form-controller.module';
import { PaginationModule } from '../shared/pagination/pagination.module';


@NgModule({
  declarations: [
    ListComponent,
    DetailComponent
  ],
  imports: [
    CommonModule,
    PropertiesRoutingModule,
    FormControllerModule,
    PaginationModule
  ]
})
export class PropertiesModule { }
