import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { Expense } from '../../models/Expense';
import { AppSettings } from '../../models/AppSettings';

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
  public settings : AppSettings;
  public shownBefore: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams,
     public dbProvider : DatabaseProvider) {
    this.is_expense = navParams.get('is_expense');
    this.type = navParams.get('type');
    this.period = navParams.get('value');
    dbProvider.getDatabaseState().subscribe(ready=>{
      if (ready){
      this.dbReady = true; 
      this.loadData();
      this.getSettings();
      this.getHintShown();
      }

    })
  }

  loadData() {
    this.dbProvider.getPeriodValues(this.is_expense,this.type,this.period).then(data => {
      this.currentItems = data;
    });
  }


  getHintShown() {
    this.dbProvider.ExpensehintShown().then(shown => {
      this.shownBefore = shown;
    })
  }



  addExpense() {

    this.navCtrl.push('AddExpensePage',{is_expense:this.is_expense, curId : this.settings.curr});
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
    
    this.navCtrl.push('AddExpensePage', { is_expense : this.is_expense,'exp': expense, 'edit': true, curId : this.settings.curr });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DailyExpensePage');
  }

  shouldShowHint(){
    return (this.settings && this.currentItems && this.currentItems.length>0 && !this.shownBefore)
  }


  ionViewDidEnter() {
    setTimeout(() => {
      if (this.shouldShowHint()) {
        this.shownBefore = true;
        this.dbProvider.setExpenseHintShown();
      }
    }, 2500);
    if (this.dbReady){
      this.loadData();
      this.getSettings();
    }
  }

  getSettings(){
    this.dbProvider.getSettings().then(data=>{
        this.settings = data;
      })
  }

}
