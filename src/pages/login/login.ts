import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';

import { User } from '../../providers';
import { MainPage } from '../';
import { Account } from '../../models/Account';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: Account;

  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService) {
    this.account = new Account();
    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
  }

  // Attempt to login in through our User service
  doLogin() {
    this.user.login(this.account).subscribe((resp) => {
      if (resp['success'] == 1)
        this.navCtrl.push(MainPage);
      else
        this.showMessage(this.loginErrorString);
    }, (err) => {
      this.showMessage(this.loginErrorString);
    });
  }
  showMessage(msg: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }


  resetPassword() {
    if (!this.account.email) {
      this.showMessage('Please enter your email address');
    } else {

      this.user.sendResetCode(this.account.email).subscribe((res) => {
        this.showMessage(!res['code'] ? 'Rest code has been ent to your email' : 'Error reset code was not sent ');
      },
        (err => {
          this.showMessage('Error reset code was not sent ');
        }));
    }
  }
}
