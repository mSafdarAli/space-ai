import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { NgChartsModule as ChartModule } from 'ng2-charts';
import { LinechartComponent } from './linechart/linechart.component';
import { BarchartComponent } from './barchart/barchart.component';
import { FormControllerModule } from '../shared/form-controller/form-controller.module';
import { PropertyListingComponent } from './property-listing/property-listing.component';





@NgModule({
  declarations: [
    DashboardComponent,
    LinechartComponent,
    BarchartComponent,
    PropertyListingComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,    
    FormControllerModule
  ]
})
export class DashboardModule { }
