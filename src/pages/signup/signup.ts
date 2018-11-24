import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, MenuController } from 'ionic-angular';
import { User } from '../../providers';
import { MainPage } from '../';
import { Account } from '../../models/Account';
import { TutorialPage } from '../tutorial/tutorial';
import { DatabaseProvider } from '../../providers/database/database';

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
  private register_uccess:string;
  private password_mismatch : string;
  private already_registered;

  constructor(public navCtrl: NavController,public menu :MenuController,
    public user: User, public dbProvider : DatabaseProvider,
    public toastCtrl: ToastController,
    public translateService: TranslateService) {
      this.account = new Account();
      let keys =['SIGNUP_ERROR','REGISTER_SUCCESS',
      'PASSWORD_MISMATCH','ALREADY_REGISTERED'];
    this.translateService.get(keys).subscribe((value) => {
      this.signupErrorString = value.SIGNUP_ERROR;
      this.register_uccess=value.REGISTER_SUCCESS;
      this.password_mismatch = value.PASSWORD_MISMATCH;
      this.already_registered = value.ALREADY_REGISTERED;

    })
  }

  doSignup() {
    // Attempt to login in through our User service
    if (this.confirm!=this.account.password){
      this.showMEssage(this.password_mismatch);
      return;
    }

    
    this.loading = true;
    this.user.signup(this.account).subscribe((resp) => {
      if (resp['data']){
      this.navCtrl.setRoot('TutorialPage');
      this.showMEssage(this.register_uccess);
      }
      else {
          this.showMEssage(resp['code']==11?this.already_registered:this.signupErrorString);
      }
      this.loading = false;
    }, (err) => {

      //this.navCtrl.push(MainPage);

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
