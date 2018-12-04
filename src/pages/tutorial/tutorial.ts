import { Component, ViewChild } from '@angular/core';
import { IonicPage, MenuController, NavController, Platform, NavParams, Slides } from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';
import { ContentPage } from '../content/content';

export interface Slide {
  title: string;
  description: string;
  image: string;
}

@IonicPage()
@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html'
})
export class TutorialPage {
  slides: Slide[];
  showSkip = true;
  public dir: string=null;
  public skip_text :string;
  public continue_text : string;
  private ext :string;
  @ViewChild (Slides) sl : Slides;

  constructor(public navCtrl: NavController, public menu: MenuController, public translate: TranslateService,
    public navParams: NavParams, public platform: Platform) {
    this.dir = platform.dir();
    console .log("direction is "+ this.dir);
    this.ext =this.dir='rtl'? '_ar':'';
    translate.get(["TUTORIAL_SLIDE1_TITLE",
      "TUTORIAL_SLIDE1_DESCRIPTION",
      "TUTORIAL_SLIDE2_TITLE",
      "TUTORIAL_SLIDE2_DESCRIPTION",
      "TUTORIAL_SLIDE3_TITLE",
      "TUTORIAL_SLIDE3_DESCRIPTION",
      "TUTORIAL_SLIDE4_TITLE",
      "TUTORIAL_SLIDE4_DESCRIPTION",
      "TUTORIAL_SLIDE5_TITLE",
      "TUTORIAL_CONTINUE_BUTTON"
    ]).subscribe(
      (values) => {
        console.log('Loaded values', values);
        this.slides = [
          {
            title: values.TUTORIAL_SLIDE1_TITLE,
            description: values.TUTORIAL_SLIDE1_DESCRIPTION,
            image: 'assets/img/languages'+this.ext+'.png',
          },
          {
            title: values.TUTORIAL_SLIDE2_TITLE,
            description: values.TUTORIAL_SLIDE2_DESCRIPTION,
            image: 'assets/img/swipe'+this.ext+'.png',
          },
          {
            title: values.TUTORIAL_SLIDE3_TITLE,
            description: values.TUTORIAL_SLIDE3_DESCRIPTION,
            image: 'assets/img/charts'+this.ext+'.png',
          },
          {
            title: values.TUTORIAL_SLIDE4_TITLE,
            description: values.TUTORIAL_SLIDE4_DESCRIPTION,
            image: 'assets/img/settings'+this.ext+'.png',
          }
        ];
        this.skip_text = values.TUTORIAL_SLIDE5_TITLE;
        this.continue_text = values.TUTORIAL_CONTINUE_BUTTON;
      });
  }


  public updateUi() {
    this.platform.setDir(this.dir=='rtl'?'rtl':'ltr', true);
    this.translate.setDefaultLang(this.dir == 'rtl' ? "ar" : "en");
    this.translate.use(this.dir == 'rtl' ? "ar" : "en");
    this.sl.direction = this.dir;
    this.sl.dir = this.dir;
  }

  startApp() {
    this.navCtrl.setRoot('ContentPage');
  }

  onSlideChangeStart(slider) {
    this.showSkip = !slider.isEnd();
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);
    this.updateUi();
  }

  ionViewWillLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }

}
