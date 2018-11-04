import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Expense } from '../../models/Expense';
import { DatabaseProvider } from '../../providers/database/database';

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
  loaded: boolean;
  currentItems: Expense[];

  constructor(public navCtrl: NavController, private dbProvider: DatabaseProvider, public modalCtrl: ModalController) {
    this.dbProvider.getDatabaseState().subscribe(ready => {
      if (ready) {
        this.dbReady = true;
        if (!this.loaded) {
          this.setCategory('day');
          this.loaded = true;
        }
      }
    })
  }
  loadExpenses(fromDate : string , toDate : string ) {
    this.dbProvider.getExpenses(fromDate, toDate).then(data => {
      this.currentItems = data;
      console.log(JSON.stringify(data));
    });
  }
  addExpense() {
    this.navCtrl.push('AddExpensePage',{'is-expense':1});
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ExpenseListPage');
  }

  ionViewDidEnter() {
    if (this.dbReady) {
      this.setCategory('day');
      this.loaded = true;
    }
  }

  deleteItem(expense: Expense) {
    this.dbProvider.deleteExpense(expense).then(data => {
      this.currentItems.splice(this.currentItems.indexOf(expense), 1);
    });
  }

  editItem(expense: Expense) {
    this.navCtrl.push('AddExpensePage', { 'exp': expense, 'edit': true });
  }

  setCategory(data: any) {
    let date = new Date();
    let toDate = date.getFullYear() + '-' + this.pareseNumber(date.getMonth() + 1) + '-' + this.pareseNumber(date.getDate());
    let fromDate = '';
    fromDate = date.getFullYear() + '-' + this.pareseNumber(date.getMonth() + 1) + '-';
    if (this.section == "day")
      fromDate = fromDate +this.pareseNumber(date.getDate());
    if (this.section=="month")
    fromDate = fromDate +'01';
    if ( this.section == "week"){
      let d = date.getDate() - date.getDay();
      fromDate = fromDate + this.pareseNumber(d);
    }
    console.log(fromDate);
    console.log(toDate);
    this.loadExpenses(fromDate,toDate);
  }

  pareseNumber(number: Number) {
    let result = "";
    if (number < 10)
      result = '0' + result;
    else
      result = '' + number;
    return result;
  }

}
