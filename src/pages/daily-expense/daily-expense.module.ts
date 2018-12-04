import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DailyExpensePage } from './daily-expense';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    DailyExpensePage,
  ],
  imports: [
    IonicPageModule.forChild(DailyExpensePage),
    TranslateModule.forChild()
  ],
})
export class DailyExpensePageModule {}
