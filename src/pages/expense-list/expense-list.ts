import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { AppSettings } from '../../models/AppSettings';
import { Stats } from '../../models/Stats';
import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the ExpenseListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-expense-list',
  templateUrl: 'expense-list.html',
})
export class ExpenseListPage {
  section: string;
  dbReady: boolean;
  public loaded: boolean;
  public empty: boolean;
  public currentItems: any[];
  public loading: boolean;
  public is_expense: boolean;
  public title: string;
  day: string = 'day';
  week: string = "week";
  month: string = "month";
  of: string = 'of';
  public shownBefore: boolean;
  public settings : AppSettings;

  constructor(public navCtrl: NavController, public dbProvider: DatabaseProvider,public platform :Platform,
    public modalCtrl: ModalController, public navParams: NavParams, public translate: TranslateService) {
    this.section = 'day';
    this.is_expense = navParams.get('is_expense');
    this.translate.get(this.is_expense ? 'EXPENSE' : 'INCOME').subscribe(tra => {
      this.title = tra;
    })
    this.getTranslation();
    this.dbProvider.getDatabaseState().subscribe(ready => {
      if (ready) {
        this.dbReady = true;
        this.getSettings();
      }
    })
  }

  public getTotal() {
    let total = 0;
    if (this.section == 'day')
      total = this.settings.balance / this.getDaysCount();
    if (this.section == 'week')
      total = 7 * (this.settings.balance / this.getDaysCount());
    if (this.section == 'month')
      total = this.settings.balance;
    return total;
  }


  getHintShown() {
    this.dbProvider.hintShown().then(shown => {
      this.shownBefore = shown;
    })
  }


  getTranslation() {
    this.translate.get(['DAY', 'WEEK', 'MONTH', 'OF']).subscribe(data => {
      this.day = data.DAY;
      this.week = data.WEEK;
      this.month = data.MONTH;
      this.of = data.OF;
    })
  }
  public getColor(percent: number) {
    let s = new Stats();
    s.setTotal(100);
    s.setSpent(percent);
    return s.getColor();
  }

  private getDaysCount(): number {
    let d = new Date();
    let days = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    return days;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExpenseListPage');
  }
  shouldShowHint(){
    return ( this.currentItems && this.currentItems.length>0 && !this.shownBefore)
  }

  ionViewDidEnter() {
    setTimeout(() => {
      if (this.shouldShowHint()) {
        this.shownBefore = true;
        this.dbProvider.setHintShown();
      }
    }, 2500);
    if (this.dbReady) {
      this.loadData(this.section);
      this.loaded = true;
      //this.getSettings();
    }
    
  }
  

  public getTitle(title: string) {
    if (!title)
      return title;
    let v = title.split('-');
    let result = "";
    if (this.section == 'day')
      result = this.day + ' ' + v[2] + ' ' + this.of + ' ' + v[1] + '-' + v[0];
    if (this.section == 'week')
      result = this.week + ' ' + v[1] + ' ' + this.of + ' ' + v[0];
    if (this.section == 'month')
      result = this.month + ' ' + v[1] + '  ' + this.of + ' ' + v[0];
    return result;
  }


  getSettings() {
    if (this.dbReady) {
      this.dbProvider.getSettings().then(data => {
        this.settings = data;
      });
    }
  }
 
  public loadData(section: string) {
    this.loading = true;
    if (this.dbReady) {
      this.dbProvider.getPeriodicValues(this.is_expense, section).then(data => {
        if (data)
          this.currentItems = data;
        else
          this.empty = true;
        this.loading = false;
      }, err => {
        this.empty = true;
        this.loading = false;
      })
    }
  }

  showCharts() {
    this.navCtrl.push('PeriodicChartsPage', { section: this.section, is_expense: this.is_expense })
  }


  showDetails(value: string) {
    this.navCtrl.push('DailyExpensePage', { value: value, type: this.section, is_expense: this.is_expense });
  }

  pareseNumber(number: Number) {
    let result = "";
    if (number < 10)
      result = '0' + number;
    else
      result = '' + number;
    return result;
  }

}
