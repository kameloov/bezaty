import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController, Platform } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Settings } from '../../providers';
import { AppSettings } from '../../models/AppSettings';

/**
 * The Welcome Page is a splash page that quickly describes the app,
 * and then directs the user to create an account or log in.
 * If you'd like to immediately put the user onto a login/signup page,
 * we recommend not using the Welcome page.
*/
@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {
  
  appSettings : AppSettings;
  showButtons : boolean = false;

  constructor(public navCtrl: NavController,public menu : MenuController,public translate :TranslateService,
    public settings : Settings, public platform : Platform) {
      settings.getSettings().then(data=>{
          this.appSettings = data;
      })
     }

  login() {
    this.navCtrl.push('LoginPage');
  }

  signup() {
    this.navCtrl.push('SignupPage');
  }

  toggleButtons(){
    this.showButtons=!this.showButtons;
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }

  public changeLang(language : number){
    console.log('settings',JSON.stringify(this.appSettings));
    this.platform.setDir(language==1?'rtl':'ltr',true);
    this.translate.setDefaultLang(language == 1 ? "ar" : "en");
    this.translate.use(language == 1 ? "ar" : "en");
    this.appSettings.language = language;
    this.settings.saveSettings(this.appSettings);
  }
}
