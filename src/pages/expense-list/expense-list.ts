import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
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
  appSettings: AppSettings;
  public loading: boolean;
  public is_expense: boolean;
  public title: string;

  constructor(public navCtrl: NavController, public dbProvider: DatabaseProvider,
    public modalCtrl: ModalController, public navParams: NavParams, public translate : TranslateService) {
    this.section = 'day';
    this.is_expense = navParams.get('is_expense');
    this.translate.get(this.is_expense?'EXPENSE':'INCOME').subscribe(tra=>{
        this.title = tra;
    })
    this.dbProvider.getDatabaseState().subscribe(ready => {
      if (ready) {
        this.dbReady = true;
        this.getSettings();
        if (!this.loaded) {
          this.loadData(this.section);
          this.loaded = true;
        }
      }
    })
  }

  public getTotal() {
    let total = 0;
    if (this.section == 'day')
      total = this.appSettings.balance / this.getDaysCount();
    if (this.section == 'week')
      total = 7 * (this.appSettings.balance / this.getDaysCount());
    if (this.section == 'month')
      total = this.appSettings.balance;
    return total;
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
  /*
    loadExpenses(fromDate : string , toDate : string ) {
      this.dbProvider.getExpenses(fromDate, toDate).then(data => {
        this.currentItems = data;
        console.log(JSON.stringify(data));
      });
    }
  
    addExpense() {
      this.navCtrl.push('AddExpensePage',{is_expense:1});
    }
    */
  ionViewDidLoad() {
    console.log('ionViewDidLoad ExpenseListPage');
  }

  ionViewDidEnter() {
    if (this.dbReady) {
      this.loadData(this.section);
      this.loaded = true;
    }
    this.getSettings();
  }

  public getTitle(title: string) {
    if (!title)
    return title;
    let v = title.split('-');
    let result = "";
    if (this.section == 'day')
      result = 'Day ' + v[2] + ' of ' + v[1] + '-' + v[0];
    if (this.section == 'week')
      result = 'Week ' + v[1] + ' of ' + v[0];
    if (this.section == 'month')
      result = 'Month ' + v[1] + ' of ' + v[0];
    return result;
  }
  getSettings() {
    if (this.dbReady) {
      this.dbProvider.getSettings().then(data => {
        this.appSettings = data;
      });
    }
  }
  /*
    deleteItem(expense: Expense) {
      this.dbProvider.deleteExpense(expense).then(data => {
        this.currentItems.splice(this.currentItems.indexOf(expense), 1);
      });
    }
  
    editItem(expense: Expense) {
      this.navCtrl.push('AddExpensePage', { 'exp': expense, 'edit': true });
    }
  
    dateTotr(date : Date){
      let result : string;
      result = date.getFullYear() + '-' + this.pareseNumber(date.getMonth() + 1) + '-' + this.pareseNumber(date.getDate());
      return result;
    }
  */


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
