import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PeriodicChartsPage } from './periodic-charts';
import { ChartsModule } from 'ng2-charts';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    PeriodicChartsPage,
  ],
  imports: [
    IonicPageModule.forChild(PeriodicChartsPage),
    ChartsModule,
    TranslateModule.forChild()
  ],
  exports:[PeriodicChartsPage]
})
export class PeriodicChartsPageModule {}
