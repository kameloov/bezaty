import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, ToastController, Platform, AlertController } from 'ionic-angular';
import { AppSettings } from '../../models/AppSettings';
import { Day } from '../../models/Day';
import { Settings, Api } from '../../providers';
import { DatabaseProvider } from '../../providers/database/database';
import { Currency } from '../../models/Currency';

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
  public languages: any[];
  public currencyList: Currency[];
  public loading: boolean;
  success_message:string;
  fail_message : string;
  public right : boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api,
    public dbProvider: DatabaseProvider, public translate: TranslateService,public alertCtrl : AlertController,
    public toastCtrl: ToastController, public settings: Settings, public platform : Platform) {
    this.appSettings = new AppSettings();
    this.getCurrencyAndSettings();
    this.days = Array();
    this.right = platform.dir()=='rtl';
    this.days.push(new Day('Sunday', 0));
    this.days.push(new Day('Monday', 1));
    this.days.push(new Day('Tuesday', 2));
    this.days.push(new Day('Wednesday', 3));
    this.days.push(new Day('Thursday', 4));
    this.days.push(new Day('Friday', 5));
    this.days.push(new Day('Saturday', 6));

    this.languages = [{ name: 'English', value: 0 }, { name: 'العربية', value: 1 }];
    this.translate.get(['OPERATION_SUCCESSFULL','OPERATION_FAILED']).subscribe(value =>{
      this.success_message= value.OPERATION_SUCCESSFULL;
      this.fail_message = value.OPERATION_FAILED;
    })
  }


  public showConfirm(action :string) {
    this.translate.get(['CONFIRM_MESSAGE', 'CONFIRM_TITLE', 'YES_BTN', 'NO_BTN']).subscribe(tra => {
      let alert = this.alertCtrl.create({
        title: tra.CONFIRM_TITLE,
        message: tra.CONFIRM_MESSAGE,
        buttons: [
          {
            text: tra.NO_BTN,
            role: 'cancel',
            handler: () => {
            
            }
          },
          {
            text: tra.YES_BTN,
            handler: () => {
              if (action=='backup')
              this.backup();
              if (action=='restore')
              this.restore();
              if(action=='reset')
              this.reset();

            }
          }
        ]
      });
      alert.present();
    })
  }

  public getCurrencyAndSettings() {
    this.dbProvider.getDatabaseState().subscribe(ready => {
      this.dbProvider.getCurrency().then(data => {
        this.currencyList = data;
        this.settings.getSettings().then((s) => {
          this.appSettings = s;
        });
      })
    })
  }

  public save() {
    this.platform.setDir(this.appSettings.language==1?'rtl':'ltr',true);
    this.translate.setDefaultLang(this.appSettings.language == 1 ? "ar" : "en");
    this.translate.use(this.appSettings.language == 1 ? "ar" : "en");
    this.settings.saveSettings(this.appSettings);
    this.navCtrl.setRoot('ContentPage');
  }

  public backup() {
    this.loading = true;
    this.dbProvider.exportDatabase().then(data => {
      console.log(this.appSettings.user_email);
      this.api.post('data/backup', { email: this.appSettings.user_email, data: JSON.stringify(data) }).subscribe(data => {
        console.log(JSON.stringify(data));
        this.showMessage(this.success_message);
        this.dbProvider.setUnsaved(false);
        this.loading = false;
      },
        err => {
          this.loading = false;
          this.showMessage(this.fail_message);
        })


    }).catch(err => {
      this.loading = false;
      this.showMessage(this.fail_message);
    })
  }

  public restore() {
    this.loading = true;
    console.log('data/' + this.appSettings.user_email);
    this.api.get('data/' + this.appSettings.user_email).subscribe(data => {
      if (data) {
        console.log(JSON.stringify(data));
        this.dbProvider.importDataBase(data).then(data => {
          this.showMessage(this.success_message);
          this.loading = false;
          this.dbProvider.getSettings().then(data=>{
            if (data){
              this.appSettings= data;
            }
          })
        }, err => {
          console.log('err', JSON.stringify(err));
          this.showMessage(this.fail_message);
          this.loading = false;
        })
      }

    }, err => {
      this.showMessage(this.fail_message);
      this.loading = false;
    })
  }

  public reset() {
    this.loading = true;
    this.dbProvider.fillDB();
    this.dbProvider.updateSettings(this.appSettings);
    this.showMessage(this.success_message);
    this.loading = false;
    this.navCtrl.setRoot('WelcomePage');
  
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
    this.settings.getSettings().then((s) => {
      console.log(JSON.stringify(s));
      this.appSettings = s;
    });
  }

}
