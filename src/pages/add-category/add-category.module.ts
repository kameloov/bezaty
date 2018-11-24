import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddCategoryPage } from './add-category';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AddCategoryPage,
  ],
  imports: [
    IonicPageModule.forChild(AddCategoryPage),
    TranslateModule.forChild()
  ],
  exports: [
    AddCategoryPage
  ]
})
export class AddCategoryPageModule {}
