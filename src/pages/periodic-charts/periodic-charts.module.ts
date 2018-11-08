import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PeriodicChartsPage } from './periodic-charts';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    PeriodicChartsPage,
  ],
  imports: [
    IonicPageModule.forChild(PeriodicChartsPage),
    ChartsModule
  ],
  exports:[PeriodicChartsPage]
})
export class PeriodicChartsPageModule {}
