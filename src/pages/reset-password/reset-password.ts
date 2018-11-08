import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { User, Settings } from '../../providers';

/**
 * Generated class for the ResetPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
})
export class ResetPasswordPage {

  public newPassword: string;
  public correct: number;
  public code: number;
  public confirmPassword: string;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public user: User, public settings: Settings, public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetPasswordPage');
  }

  changePassword() {
    if (this.code == this.correct) {
      if (this.newPassword == this.confirmPassword) {
        let mail = "";
        this.settings.getSettings().then((data) => {
          mail = data.email;
          this.user.resetPassword(mail, this.newPassword).subscribe((res) => {
            this.showMessage(res['success'] == 1 ? 'password changed Successfuly' : 'Error password was not changed');
          },
            (err) => {
              this.showMessage('Error password was not changed');
            }
          )
        })

      } else
        this.showMessage('password and confirmation are different');
    } else
      this.showMessage('Wrong code , please try again');
  }

  showMessage(msg: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
}
