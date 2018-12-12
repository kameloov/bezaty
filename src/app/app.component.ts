import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { Config, Nav, Platform, AlertController, Alert, ModalController, ToastController, LoadingController } from 'ionic-angular';
import { Settings, Api } from '../providers';
import { DatabaseProvider } from '../providers/database/database';
import { LocalNotifications, ELocalNotificationTriggerUnit } from '@ionic-native/local-notifications';
import { AppSettings } from '../models/AppSettings';

@Component({
  template: ` <ion-menu [content]="content" [attr.side]="this.platform.is('android') && this.platform.dir()=='rtl'?'right':'left' " persistent="true">
    <ion-header>
      <ion-toolbar>
        <ion-title></ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <button menuClose [ngClass]="{'exit-btn':p.exit==true}" ion-item *ngFor="let p of pages" text-center (click)="openPage(p)">
          {{p.title|translate}}
        </button>
      </ion-list>
    </ion-content>

  </ion-menu>
  <ion-nav #content [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage = 'DefaultPage';
  public alerted: boolean;
  public alert: Alert;
  public side: string = "left"
  public appSettings: AppSettings;
  reminder_msg: string;
  public loadingDlg : any;
  @ViewChild(Nav) nav: Nav;
  pages: any[] = [
    { title: 'MENU_HOME', component: 'ContentPage', root: true },
    { title: 'MENU_CATEGORY', component: 'ListMasterPage' },
    { title: 'MENU_EXPENSE', component: 'ExpenseListPage', params: { is_expense: true } },
    { title: 'MENU_INCOME', component: 'ExpenseListPage', params: { is_expense: false } },
    { title: 'MENU_SETTINGS', component: 'SettingsPage' },
    { title: 'MENU_EXIT', component: 'WelcomePage', root: true, exit: true }
  ]
  success_message: any;
  fail_message: any;

  constructor(private translate: TranslateService, public platform: Platform, public notification: LocalNotifications,
    public dbProvider: DatabaseProvider, public settings: Settings, private config: Config, public api: Api,
    private statusBar: StatusBar, private splashScreen: SplashScreen, public toastCtrl: ToastController,
    public alertCtrl: AlertController,public loadingCtrl : LoadingController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString('#3a8dc2');
      let state = this.dbProvider.getDatabaseState().subscribe((ready) => {
        if (ready) {
          this.settings.getSettings().then(data => {
            this.appSettings = data;
            this.initTranslate();
            this.handleLoginState();
            platform.pause.subscribe(() => {
              console.log(' on pause fired');
              if (data.notification > 0) {
                translate.get('NOTIFICATION_MSG').subscribe(msg => {
                  notification.schedule({
                    id: 1,
                    text: msg,
                    trigger: { every: data.notification, unit: ELocalNotificationTriggerUnit.DAY }
                  });
                })

              } else
                notification.cancelAll();
            });

            platform.resume.subscribe(() => {
              console.log('on resume ');
              notification.cancelAll();
            })
          });
        }
        if (state)
        state.unsubscribe();
      })
    });

  }


  handleLoginState(){
    this.dbProvider.isLogged().then(data => {
      console.log('is logged', data);
      if (data) {
        this.rootPage = 'ContentPage'
      }
      else
        this.rootPage = 'WelcomePage'
      this.splashScreen.hide();
    }, err => {
      this.splashScreen.hide();
    });
  }

  initTranslate() {
      this.platform.setDir(this.appSettings.language == 1 ? 'rtl' : 'ltr', true);
      this.translate.setDefaultLang(this.appSettings.language == 0 ? "en" : "ar");
      this.translate.use(this.appSettings.language == 0 ? "en" : "ar");
      this.side = this.appSettings.language == 1 ? 'right' : 'left';
    this.translate.get(['OPERATION_SUCCESSFULL', 'OPERATION_FAILED']).subscribe(value => {
      this.success_message = value.OPERATION_SUCCESSFULL;
      this.fail_message = value.OPERATION_FAILED;
    })
    this.config.set('ios', 'backButtonText', " ");
  }


  public showConfirm() {
    this.translate.get(['CONFIRM_BACKUP_MESSAGE', 'CONFIRM_TITLE', 'YES_BTN', 'NO_BTN']).subscribe(tra => {
      let alert = this.alertCtrl.create({
        title: tra.CONFIRM_TITLE,
        message: tra.CONFIRM_BACKUP_MESSAGE,
        buttons: [
          {
            text: tra.NO_BTN,
            role: 'cancel',
            handler: () => {
              this.logout();
            }
          },
          {
            text: tra.YES_BTN,
            handler: () => {
              this.showLoadingDialog();
              this.backup();
            }
          }
        ]
      });
      alert.present();
    })
  }

  showLoadingDialog(){
    this.loadingDlg = this.loadingCtrl.create({
      content :''
    });
    this.loadingDlg.present();
  }

  public backup() {
    this.settings.getSettings().then(s=>{
    this.dbProvider.exportDatabase().then(data => {
      this.api.post('data/backup', { email: s.user_email, data: JSON.stringify(data) }).subscribe(response => {
        console.log(JSON.stringify(response))
        this.showMessage(this.success_message);
        this.dbProvider.setUnsaved(false);
        this.logout();
        this.loadingDlg.dismiss();
      },
        err => {
          this.showMessage(this.fail_message);
          this.loadingDlg.dismiss();
        })
    });
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

  logout() {
    this.dbProvider.setLogged(false);
    this.nav.setRoot('WelcomePage');
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.exit) {
      this.dbProvider.getUnsaved().then(unsaved => {
        if (unsaved) {
          this.showConfirm();
        } else {
          this.logout();
        }
      })

    } else
      if (page.root)
        this.nav.setRoot(page.component, page.params);
      else
        this.nav.push(page.component, page.params);
  }
}
