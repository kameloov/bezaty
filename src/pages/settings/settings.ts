import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppSettings } from '../../models/AppSettings';
import { Day } from '../../models/Day';
import { Settings } from '../../providers';

/**
 * The Settings page is a simple form that syncs with a Settings provider
 * to enable the user to customize settings for the app.
 *
 */
@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  // Our local settings object
  appSettings: AppSettings;
  days: Day[];
  languages : any[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public translate: TranslateService, public settings: Settings) {
    this.appSettings = new AppSettings();
    settings.getSettings().then((s)=>{
      this.appSettings = s;
    })
    this.days = Array();
    this.days.push(new Day('Sunday',0));
    this.days.push(new Day('Monday',1));
    this.days.push(new Day('Tuesday',2));
    this.days.push(new Day('Wednesday',3));
    this.days.push(new Day('Thursday',4));
    this.days.push(new Day('Friday',5));
    this.days.push(new Day('Saturday',6));

    this.languages = [{name : 'English', value : 0},{name :'Arabic', value : 1}];


  }

  save(){
    this.settings.saveSettings(this.appSettings);
  }

  ionViewDidEnter() {
    
  }

}
