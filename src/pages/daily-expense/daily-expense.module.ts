import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DailyExpensePage } from './daily-expense';

@NgModule({
  declarations: [
    DailyExpensePage,
  ],
  imports: [
    IonicPageModule.forChild(DailyExpensePage),
  ],
})
export class DailyExpensePageModule {}
