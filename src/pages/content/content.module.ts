import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import {ChartsModule} from 'ng2-charts';
import { ContentPage } from './content';
import {CommonModule} from '@angular/common';
import { NgCircleProgressModule } from 'ng-circle-progress';
@NgModule({
  declarations: [
    ContentPage,
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
    IonicPageModule.forChild(ContentPage),
    TranslateModule.forChild(),
    ChartsModule,
    CommonModule
  ],
  exports: [
    ContentPage,
    NgCircleProgressModule,
    CommonModule
  ]
})
export class ContentPageModule { }
