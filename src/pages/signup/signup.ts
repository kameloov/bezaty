import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, MenuController } from 'ionic-angular';
import { User } from '../../providers';
import { MainPage } from '../';
import { Account } from '../../models/Account';
import { TutorialPage } from '../tutorial/tutorial';
import { DatabaseProvider } from '../../providers/database/database';
import { AppSettings } from '../../models/AppSettings';
import { Subscriber, Subscription } from 'rxjs';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  account: Account;
  public confirm : string;
  public loading  : boolean ;
  public settings : AppSettings;
  private signupErrorString: string;
  private register_uccess:string;
  private password_mismatch : string;
  private already_registered;
  private state : Subscription;


  constructor(public navCtrl: NavController,public menu :MenuController,
    public user: User, public dbProvider : DatabaseProvider,
    public toastCtrl: ToastController,
    public translateService: TranslateService) {
       this.state = dbProvider.getDatabaseState().subscribe(ready=>{
        if (ready)
        this.getSettings();
      })
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

  getSettings(){
    this.dbProvider.getSettings().then(data=>{
      this.settings = data;
    })
  }

  doSignup() {
    // Attempt to login in through our User service
    if (this.confirm!=this.account.password){
      this.showMEssage(this.password_mismatch);
      return;
    }
    this.loading = true;
    this.user.signup(this.account,this.settings.language).subscribe((resp) => {
      if (resp['data']){
      this.navCtrl.setRoot('TutorialPage',{dir :this.settings.language==1?"rtl":"ltr"});
      this.showMEssage(this.register_uccess);
      }
      else {
          this.showMEssage(resp['code']==11?this.already_registered:this.signupErrorString);
      }
      this.loading = false;
    }, (err) => {
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
    //this.state.unsubscribe();
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
