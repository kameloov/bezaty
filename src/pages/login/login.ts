import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, AlertController, MenuController } from 'ionic-angular';

import { User, Api } from '../../providers';
import { MainPage } from '../';
import { Account } from '../../models/Account';
import { DatabaseProvider } from '../../providers/database/database';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  public account: Account;
  public loading: boolean;
  // Our translated text strings
  private loginErrorString: string;
  private restore_title: string;

  constructor(public navCtrl: NavController, public api: Api, public menu: MenuController,
    public user: User, public alertCtrl: AlertController,
    public toastCtrl: ToastController, public dbProvider: DatabaseProvider,
    public translateService: TranslateService) {
    this.account = new Account();
    this.translateService.get(['LOGIN_ERROR', 'RESTORE_TITLE']).subscribe((value) => {
      this.loginErrorString = value.LOGIN_ERROR;
      this.restore_title = value.REsTORE_TITLE;
    })
  }

  
 
  // Attempt to login in through our User service
  doLogin() {
    this.loading = true;
    this.user.login(this.account).subscribe((resp) => {
      console.log(JSON.stringify(resp))
      if (resp['success'] == 1) {
        if (resp['data'][0]['data_file'])
          this.showRestore(resp['data'][0]['backup_date']);
        else{
          this.navCtrl.setRoot(MainPage);
        }
      } else
        this.showMessage(this.loginErrorString);
      this.loading = false;
    }, (err) => {
      this.showMessage(this.loginErrorString);
      this.loading = false;
    });
  }
  
  showRestore(date: string) {
    this.translateService.get(['RESTORE_MESSAGE', 'RESTORE_TITLE', 'YES_BTN', 'NO_BTN'], { value: date }).subscribe(tra => {
      let alert = this.alertCtrl.create({
        title: tra.RESTORE_TITLE,
        message: tra.RESTORE_MESSAGE,
        buttons: [
          {
            text: tra.NO_BTN,
            role: 'cancel',
            handler: () => {
              this.navCtrl.setRoot(MainPage);
            }
          },
          {
            text: tra.YES_BTN,
            handler: () => {
              this.restore();
            }
          }
        ]
      });
      alert.present();
    })
  }

  showMessage(msg: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  showTranslatedMessage(key :string){
    this.translateService.get(key).subscribe(data=>{
      this.showMessage(data);
    })
  }

  public restore() {
    this.loading = true;
    console.log('data/' + this.account.email);
    this.api.get('data/' + this.account.email).subscribe(data => {
      if (data) {
        console.log(JSON.stringify(data));
        this.dbProvider.importDataBase(data).then(data => {
          this.translateService.get('RESTORE_SUCCESS').subscribe(data => {
            this.showMessage(data);
            this.loading = false;
            this.navCtrl.setRoot(MainPage);
          })

        }, err => {
          console.log('err', JSON.stringify(err));
          this.showTranslatedMessage('RESTORE_ERROR');
          this.loading = false;
          this.navCtrl.push(MainPage);
        })
      }

    }, err => {
      this.showTranslatedMessage('RESTORE_ERROR');
      this.loading = false;
    })
  }
  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }
  resetPassword() {
    if (!this.account.email) {
      this.showTranslatedMessage('EMAIL_EMPTY');
    } else {
      this.navCtrl.push('ResetPasswordPage',{code :1550});
      this.user.sendResetCode(this.account.email).subscribe((res) => {
        this.showTranslatedMessage(!res['code'] ? 'CODE_SENT' : 'CODE_NOT_SENT');
      },
        (err => {
          this.showTranslatedMessage('CODE_NOT_SENT');
        }));
    }
  }
}
