import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StatisticsPage } from './statistics';
import { NgCircleProgressModule } from 'ng-circle-progress';
@NgModule({
  declarations: [
    StatisticsPage,
  ],
  imports: [
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 50,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      showSubtitle:false,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
    }),
    IonicPageModule.forChild(StatisticsPage),
  ],
  exports :[StatisticsPage]
})
export class StatisticsPageModule {}
