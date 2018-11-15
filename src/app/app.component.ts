import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { Config, Nav, Platform, AlertController, Alert } from 'ionic-angular';
import { Settings } from '../providers';
import { DatabaseProvider } from '../providers/database/database';
import { LocalNotifications, ELocalNotificationTriggerUnit } from '@ionic-native/local-notifications';
import { DefaultPage } from '../pages/default/default';


@Component({
  template: ` <ion-menu [content]="content" persistent="true">
    <ion-header>
      <ion-toolbar>
        <ion-title>Pages</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">
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

  reminder_msg: string;
  @ViewChild(Nav) nav: Nav;
  pages: any[] = [
    { title:'MENU_HOME', component: 'ContentPage', root: true },
    { title: 'MENU_CATEGORY', component: 'ListMasterPage' },
    { title:'MENU_EXPENSE', component: 'ExpenseListPage', params: { is_expense: true } },
    { title:'MENU_INCOME', component: 'ExpenseListPage', params: { is_expense: false } },
    { title: 'MENU_SETTINGS', component: 'SettingsPage' },
    { title: 'MENU_EXIT', component: 'WelcomePage', root: true }
  ]

  constructor(private translate: TranslateService, public platform: Platform, public notification: LocalNotifications,
    public dbProvider: DatabaseProvider, public settings: Settings, private config: Config,
    private statusBar: StatusBar, private splashScreen: SplashScreen, public alertCtrl: AlertController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      platform.pause.subscribe(() => {
        console.log(' on pause fired');
        this.settings.getSettings().then(data => {
          if (data.notification > 0) {
            translate.get('NOTIFICATION_MSG').subscribe(data => {
              notification.schedule({
                id: 1,
                text: 'hello',
                trigger: { every: data.notification, unit: ELocalNotificationTriggerUnit.MINUTE }
              });
            })

          } else
            notification.cancelAll();
        });

      });
      platform.resume.subscribe(() => {
        console.log('on resume ');
        notification.cancelAll();
      })

      platform.registerBackButtonAction(() => {
        if (this.alerted) {
          this.alert.dismiss();
        } else {
          if (this.nav.length() == 1) {
            this.showConfirm();
          }
          this.alerted = true;
        }
      })

      //notification.cancelAll();
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString('#3a8dc2')
      this.dbProvider.getDatabaseState().subscribe((ready) => {
        if (ready) {
          this.dbProvider.getSettings().then(data => {
            if (data.user_email)
              this.rootPage = 'ContentPage'
            else
              this.rootPage = 'WelcomePage'
            this.splashScreen.hide();
          }, err => {
            this.splashScreen.hide();
          });
          this.initTranslate();
        }
      })

    });

  }

  showConfirm() {
    this.alert = this.alertCtrl.create({
      title: 'Exit ?',
      message: 'Are you sure you want  to exit ?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {

          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.platform.exitApp();
          }
        }
      ]
    });
    this.alert.present();
  }

  initTranslate() {
    const browserLang = this.translate.getBrowserLang();
    this.settings.getSettings().then(data => {
      this.translate.setDefaultLang(data.language == 0 ? "en" : "ar");
      this.platform.setDir(data.language == 1 ? 'rtl' : 'ltr', true);
      console.log("language ", data.language);
    })
    /*     if (browserLang) {
          this.settings.
            this.translate.use(this.translate.getBrowserLang());
          //this.translate.use("ar");
        } else {
          this.translate.use('en'); // Set your language here
        }
     */
    let keys = ['BACK_BUTTON_TEXT'];
    this.translate.get(keys).subscribe(values => {
      console.log(JSON.stringify(values));
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
     
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.root)
      this.nav.setRoot(page.component, page.params);
    else
      this.nav.push(page.component, page.params);
  }
}
