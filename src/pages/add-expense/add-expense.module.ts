import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddExpensePage } from './add-expense';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AddExpensePage,
  ],
  imports: [
    IonicPageModule.forChild(AddExpensePage),
    TranslateModule.forChild()
  ],
   exports:[AddExpensePage]
})
export class AddExpensePageModule {}
