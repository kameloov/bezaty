import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { Config, Nav, Platform, AlertController, Alert, ModalController } from 'ionic-angular';
import { Settings } from '../providers';
import { DatabaseProvider } from '../providers/database/database';
import { LocalNotifications, ELocalNotificationTriggerUnit } from '@ionic-native/local-notifications';

@Component({
  template: ` <ion-menu [content]="content" [attr.side]="this.platform.dir()=='ltr'?'left':'right' " persistent="true">
    <ion-header>
      <ion-toolbar>
        <ion-title></ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <button menuClose [ngClass]="{'exit-btn':p.exit==true}" ion-item *ngFor="let p of pages" (click)="openPage(p)">
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
  reminder_msg: string;
  @ViewChild(Nav) nav: Nav;
  pages: any[] = [
    { title: 'MENU_HOME', component: 'ContentPage', root: true },
    { title: 'MENU_CATEGORY', component: 'ListMasterPage' },
    { title: 'MENU_EXPENSE', component: 'ExpenseListPage', params: { is_expense: true } },
    { title: 'MENU_INCOME', component: 'ExpenseListPage', params: { is_expense: false } },
    { title: 'MENU_SETTINGS', component: 'SettingsPage' },
    { title: 'MENU_EXIT', component: 'WelcomePage', root: true, exit: true }
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

      });
      platform.resume.subscribe(() => {
        console.log('on resume ');
        notification.cancelAll();
      })

      /*     platform.registerBackButtonAction(() => {
            if (this.alerted) {
              this.alert.dismiss();
              this.alerted = false;
            } else {
              if (this.nav.getActive().name=='ContentPage') {
                this.showConfirm();
                this.alerted = true;
              } else 
              return false;
            }
          }) */

      //notification.cancelAll();
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString('#3a8dc2')
      let state = this.dbProvider.getDatabaseState().subscribe((ready) => {
        if (ready) {
          this.initTranslate();
          this.dbProvider.isLogged().then(data => {
            console.log('is logged',data);
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
        if (state)
        state.unsubscribe();
      })

    });

  }

  initTranslate() {
    const browserLang = this.translate.getBrowserLang();
    this.settings.getSettings().then(data => {
      this.platform.setDir(data.language == 1 ? 'rtl' : 'ltr', true);
      this.translate.setDefaultLang(data.language == 0 ? "en" : "ar");
      this.translate.use(data.language == 0 ? "en" : "ar");
      this.side = data.language == 1 ? 'right' : 'left';
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
    if (page.exit){
      this.dbProvider.setLogged(false);
    }
    if (page.root)
      this.nav.setRoot(page.component, page.params);
    else
      this.nav.push(page.component, page.params);
  }
}
