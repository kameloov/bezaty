import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, Alert, AlertController, MenuController } from 'ionic-angular';
import { Stats } from '../../models/Stats';
import { DatabaseProvider } from '../../providers/database/database';
import { Settings } from '../../providers';
import { TranslateService } from '@ngx-translate/core';
import { AppSettings } from '../../models/AppSettings';
@IonicPage()
@Component({
  selector: 'page-content',
  templateUrl: 'content.html'
})

export class ContentPage {


  width: number = 20;
  radius: number;
  daily: Stats;
  weekly: Stats;
  monthly: Stats;
  dbReady: boolean;
  total: number;
  public loading: boolean;
  public fromWeek: string;
  public fromMonth: string;
  public to: string;
  public appSettings: AppSettings;
  alerted: boolean;
  public alert: Alert;
  unregister: Function;

  constructor(public navCtrl: NavController, private dbProvider: DatabaseProvider,
    public alertCtrl: AlertController, public menuCtrl: MenuController,
    public settings: Settings, public platform: Platform, public translate: TranslateService) {
    this.loading = true;
    this.daily = new Stats();
    this.weekly = new Stats();
    this.monthly = new Stats();
    //  this.refreshValues();
    platform.ready().then(res => {
      this.width = platform.width();
    });
  }

  private refreshValues() {
    this.loading = true;
    this.dbProvider.getDatabaseState().subscribe((ready) => {
      if (ready) {
        this.dbReady = true;
        this.loadStatistics();
      } else
        this.loading = false;

    })
  }


  showConfirm() {
    this.translate.get(['EXIT_TITLE', 'EXIT_MSG', 'YES_BTN', 'NO_BTN']).subscribe(data => {
      this.alert = this.alertCtrl.create({
        title: data.EXIT_TITLE,
        message: data.EXIT_MSG,
        buttons: [
          {
            text: data.NO_BTN,
            role: 'cancel',
            handler: () => {

            }
          },
          {
            text: data.YES_BTN,
            handler: () => {
              this.platform.exitApp();
            }
          }
        ]
      });
      this.alert.present();
    })
  }

  private getDaysCount(): number {
    let d = new Date();
    let days = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    return days;
  }

  loadStatistics(): any {

    if (this.dbReady) {
      this.dbProvider.getSettings().then((data) => {
        this.total = data.balance;
        this.appSettings = data;
        let perDay = this.total / this.getDaysCount();
        this.daily.setTotal(perDay);
        this.weekly.setTotal(perDay * 7);
        this.monthly.setTotal(this.total);
        this.translate.use(data.language == 1 ? "ar" : "en");
        this.translate.setDefaultLang(data.language == 1 ? "ar" : "en");
      })
      let d = new Date();
      this.to = this.dateTostr(d);
      this.dbProvider.getTotalExpense(this.to, this.to).then((spent) => {
        this.daily.setSpent(spent ? spent : 0);
      });
      this.fromWeek = this.dateTostr(new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7));
      this.dbProvider.getTotalExpense(this.fromWeek, this.to).then((spent) => {
        this.weekly.setSpent(spent ? spent : 0);
      });
      this.fromMonth = this.dateTostr(new Date(d.getFullYear(), d.getMonth(), 1));
      this.dbProvider.getTotalExpense(this.fromMonth, this.to).then((spent) => {
        this.monthly.setSpent(spent ? spent : 0);
      });
      console.log('to', this.to);
      console.log('month', this.fromMonth);
      console.log('week', this.fromWeek);

    }
  }

  registerBack() {
    this.unregister = this.platform.registerBackButtonAction(() => {
      if (this.menuCtrl.isOpen()) {
        this.menuCtrl.close();
        return;
      }
      if (this.alerted) {
        this.alert.dismiss();
        this.alerted = false;
      } else {
        this.showConfirm();
        this.alerted = true;
      }

    })

  }

  public showMonthStatistics() {
    this.navCtrl.push('StatisticsPage', { fromDate: this.fromMonth, toDate: this.to });
  }

  public showDayStatistics() {
    this.navCtrl.push('StatisticsPage', { fromDate: this.to, toDate: this.to });
  }
  public showWeekStatistics() {
    this.navCtrl.push('StatisticsPage', { fromDate: this.fromWeek, toDate: this.to });
  }

  showAdd(is_expense: boolean) {
    console.log('app settings',JSON.stringify(this.appSettings));
    this.navCtrl.push("AddExpensePage", { is_expense: is_expense, curId : this.appSettings.curr })
  }

  showCategories() {
    this.navCtrl.push('ListMasterPage');
  }

  ionViewDidEnter() {
    this.registerBack();
    this.refreshValues();
  }

  ionViewDidLeave() {
    this.unregister();
  }


  dateTostr(date: Date) {
    return this.parse('' + date.getFullYear()) + '-' + this.parse('' + (date.getMonth() + 1)) + '-' + this.parse('' + date.getDate());
  }

  parse(value: string) {
    let r = value.length > 1 ? value : "0" + value;
    console.log(r);
    return r;
  }

}
