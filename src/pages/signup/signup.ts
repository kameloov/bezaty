import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, MenuController } from 'ionic-angular';
import { User } from '../../providers';
import { MainPage } from '../';
import { Account } from '../../models/Account';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: Account;
  public confirm : string;
  public loading  : boolean ;
  // Our translated text strings
  private signupErrorString: string;

  constructor(public navCtrl: NavController,public menu :MenuController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService) {
      this.account = new Account();
    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    })
  }

  doSignup() {
    // Attempt to login in through our User service
    if (this.confirm!=this.account.password){
      this.showMEssage('Password and confirmation does not match ');
      return;
    }

    this.loading = true;
    this.user.signup(this.account).subscribe((resp) => {
      if (resp['data']){

      this.navCtrl.push(MainPage);
      this.showMEssage('Registered Successfully');
      }
      else {
          this.showMEssage(resp['code']==11?'You are already registered , please login instead':this.signupErrorString);
      }
      this.loading = false;
    }, (err) => {

      this.navCtrl.push(MainPage);

      // Unable to sign up
      this.showMEssage(this.signupErrorString);
      this.loading = false;
    });
  }


  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }
  showMEssage(msg : string){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
}
