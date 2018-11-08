import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CategoryChartsPage } from './category-charts';

@NgModule({
  declarations: [
    CategoryChartsPage,
  ],
  imports: [
    IonicPageModule.forChild(CategoryChartsPage),
  ],
})
export class CategoryChartsPageModule {}
