import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StatisticsPage } from './statistics'
import { ChartsModule } from 'ng2-charts';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    StatisticsPage,
  ],
  imports: [
    IonicPageModule.forChild(StatisticsPage),
    ChartsModule,
    TranslateModule.forChild()
  ],
  exports :[StatisticsPage]
})
export class StatisticsPageModule {}
