import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AppSettings } from '../../models/AppSettings';
import { Day } from '../../models/Day';
import { Settings, Api } from '../../providers';
import { DatabaseProvider } from '../../providers/database/database';

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
  public appSettings: AppSettings;
  public days: Day[];
  public languages : any[];
  public loading : boolean ;

  constructor(public navCtrl: NavController, public navParams: NavParams,public api : Api,
    public dbProvider : DatabaseProvider, public translate: TranslateService, 
    public toastCtrl : ToastController, public settings: Settings) {
    this.appSettings = new AppSettings();
    settings.getSettings().then((s)=>{
      this.appSettings = s;
    });
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

  public save(){
    this.settings.saveSettings(this.appSettings);
    this.navCtrl.setRoot('ContentPage');
  }

public backup(){
  this.loading = true;
  this.dbProvider.exportDatabase().then(data=>{
    console.log(this.appSettings.user_email);
    this.api.post('data/backup',{email:this.appSettings.user_email,data:JSON.stringify(data)}).subscribe(data=>{
      console.log(JSON.stringify(data));
      this.showMessage('backup completed successfully');
      this.loading = false;
  },
  err=>{
    this.loading = false;
    this.showMessage('error getting database from server ');
  })
  

  }).catch(err=>{
    this.loading = false;
    this.showMessage('error exporting dabase ');
  })
}

public restore(){
  this.loading = true;
  console.log('data/'+this.appSettings.user_email);
 this.api.get('data/'+this.appSettings.user_email).subscribe(data=>{
   if (data){
     console.log(JSON.stringify(data));
     this.dbProvider.importDataBase(data).then(data=>{
       this.showMessage('restore completed successfully');
       this.loading = false;
     },err=>{
       console.log('err',JSON.stringify(err));
      this.showMessage('restore data  error');
      this.loading = false;
     })
   }
  
 },err=>{
  this.showMessage('restore network  error');
  this.loading = false;
 })
}

public reset(){
  this.loading = true;
  let s = this .appSettings;
this.dbProvider.fillDB();
this.dbProvider.updateSettings(this.appSettings);
this.showMessage('data base was reset successfully');
this.loading = false;
}


showMessage(msg: string) {
  let toast = this.toastCtrl.create({
    message: msg,
    duration: 3000,
    position: 'top'
  });
  toast.present();
}

   ionViewDidEnter() {
    this.settings.getSettings().then((s)=>{
      console.log(JSON.stringify(s));
      this.appSettings = s;
    });
  }

}
