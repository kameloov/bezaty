import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExpenseListPage } from './expense-list';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ExpenseListPage,
  ],
  imports: [
    IonicPageModule.forChild(ExpenseListPage),
    TranslateModule.forChild(),
    NgCircleProgressModule.forRoot({
      "radius": 25,
      "space": -4,
      "outerStrokeWidth": 4,
      "outerStrokeColor": "#4882c2",
      "innerStrokeColor": "#e7e8ea",
      "innerStrokeWidth": 4,
      "title": "",
      "animateTitle": false,
      "showSubtitle": false,
      "animationDuration": 100,
      "showUnits": false,
      "showBackground": false,
      "clockwise": true
    })
  ], 
  exports:[ExpenseListPage,NgCircleProgressModule]
})
export class ExpenseListPageModule {}
