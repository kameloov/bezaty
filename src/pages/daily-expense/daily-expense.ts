import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { Expense } from '../../models/Expense';

/**
 * Generated class for the DailyExpensePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-daily-expense',
  templateUrl: 'daily-expense.html',
})
export class DailyExpensePage {

  public loading : boolean ; 
  public dbReady : boolean ; 
  public currentItems : Expense [];
  public period : string;
  public is_expense : boolean ; 
  public type : string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public dbProvider : DatabaseProvider) {
    this.is_expense = navParams.get('is_expense');
    this.type = navParams.get('type');
    this.period = navParams.get('value');
    dbProvider.getDatabaseState().subscribe(ready=>{
      if (ready){
      this.dbReady = true; 
      this.loadData()
      }

    })
  }

  loadData() {
    this.dbProvider.getPeriodValues(this.is_expense,this.type,this.period).then(data => {
      this.currentItems = data;
    });
  }

  addExpense() {
    this.navCtrl.push('AddExpensePage',{is_expense:this.is_expense});
  }


  deleteItem(expense: Expense) {
    if(this.is_expense){
    this.dbProvider.deleteExpense(expense).then(data => {
      this.currentItems.splice(this.currentItems.indexOf(expense), 1);
    });
  } else {
    this.dbProvider.deleteIncome(expense).then(data => {
      this.currentItems.splice(this.currentItems.indexOf(expense), 1);
    });
  }
  }

  editItem(expense: Expense) {
    this.navCtrl.push('AddExpensePage', { is_expense : this.is_expense,'exp': expense, 'edit': true });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DailyExpensePage');
  }
  ionViewDidEnter() {
    if (this.dbReady)
      this.loadData();
  }

}
