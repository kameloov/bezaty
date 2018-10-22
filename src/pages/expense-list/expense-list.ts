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
  dbReady: boolean;
  loaded: boolean;
  currentItems: Expense[];


  constructor(public navCtrl: NavController, private dbProvider: DatabaseProvider, public modalCtrl: ModalController) {
    this.dbProvider.getDatabaseState().subscribe(ready => {
      if (ready) {
        this.dbReady = true;
        if (!this.loaded) {
          this.loadExpenses();
          this.loaded = true;
        }
      }
    })
  }

  loadExpenses() {
    this.dbProvider.getExpenses("2018-10-01","2018-10-25").then(data => {
      this.currentItems = data;
      console.log(JSON.stringify(data));
    });
  }
  addExpense() {
    this.navCtrl.push('AddExpensePage');
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ExpenseListPage');
  }

  ionViewDidEnter() {
    if (this.dbReady) {
        this.loadExpenses();
        this.loaded = true;
    }
  }

  deleteItem(expense : Expense) {
    this.dbProvider.deleteExpense(expense).then(data=>{
        this.currentItems.splice(this.currentItems.indexOf(expense),1);
    });
  }

  editItem(expense : Expense) {
    this.navCtrl.push('AddExpensePage',{'exp':expense,'edit':true});
  }

}
