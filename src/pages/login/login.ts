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
  public loading : boolean ; 
  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,public api : Api,public menu : MenuController,
    public user: User,public alertCtrl : AlertController,
    public toastCtrl: ToastController,public dbProvider : DatabaseProvider,
    public translateService: TranslateService) {
    this.account = new Account();
    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
  }

  // Attempt to login in through our User service
  doLogin() {
    this.loading = true;
    this.user.login(this.account).subscribe((resp) => {
      console.log(JSON.stringify(resp))
      if (resp['success'] == 1){
        if(resp['data'][0]['data_file'])
          this.showRestore();
          else
        this.navCtrl.setRoot(MainPage);
      } else
        this.showMessage(this.loginErrorString);
        this.loading = false;
    }, (err) => {
      this.showMessage(this.loginErrorString);
      this.loading = false;
    });
  }
  showRestore(){
    let alert = this.alertCtrl.create({
      title: 'Restore ?',
      message: 'Theres is a backup verion of a previous data do you want to restore it now ?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            this.navCtrl.push(MainPage);
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.restore();
          }
        }
      ]
    });
    alert.present();
  }
  showMessage(msg: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  public restore(){
    this.loading = true;
    console.log('data/'+this.account.email);
   this.api.get('data/'+this.account.email).subscribe(data=>{
     if (data){
       console.log(JSON.stringify(data));
       this.dbProvider.importDataBase(data).then(data=>{
         this.showMessage('restore completed successfully');
         this.loading = false;
         this.navCtrl.push(MainPage);
       },err=>{
         console.log('err',JSON.stringify(err));
        this.showMessage('restore data  error');
        this.loading = false;
        this.navCtrl.push(MainPage);
       })
     }
    
   },err=>{
    this.showMessage('restore network  error');
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
