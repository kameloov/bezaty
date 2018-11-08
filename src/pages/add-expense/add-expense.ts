import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Expense } from '../../models/Expense';
import { Category } from '../../models/Category';
import { DatabaseProvider } from '../../providers/database/database';

/**
 * Generated class for the AddExpensePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-expense',
  templateUrl: 'add-expense.html',
})
export class AddExpensePage {
  expense: Expense;
  categories: Category[];
  dbReady: boolean;
  edit: boolean;
  public isExpense : boolean;
  public title : string;
  constructor(public navCtrl: NavController, private toastCtrl: ToastController, private dbProvider: DatabaseProvider, public navParams: NavParams) {
    this.isExpense = navParams.get('is_expense');
    this.title = this.isExpense ? 'Add expense ': 'Add income ';
    this.edit = this.navParams.get('edit');
    if (this.edit) {
      this.expense = navParams.get('exp');
    } else {
      this.expense = new Expense();
      this.expense.item_date = "" + Date.now();
    }
    this.categories = [];
    this.dbProvider.getDatabaseState().subscribe(ready => {
      if (ready) {
        this.dbReady = true;
        this.loadCategories();
      }
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddExpensePage');
  }

  loadCategories() {
    this.dbProvider.getCategories(this.isExpense? 1 : 0).then(data => {
      this.categories = data;
      console.log("categories",JSON.stringify(data));
    });
  }
  addExpense() {
    if (!this.expense.title || !this.expense.category_id || !this.expense.value) {
      this.showErrorMessage('please make sure to fill the missing fields');
      return;
    }
    if (this.edit)
      this.editCurrent();
    else
      this.addNew();
  }

  addNew() {
    if (this.isExpense){
    this.dbProvider.addExpense(this.expense).then(data => {
      if (!data)
        this.showErrorMessage('Error , expense was not added');
      else
        this.navCtrl.pop();
    });
  } else {
      this.dbProvider.addIncome(this.expense).then(data => {
        if (!data)
          this.showErrorMessage('Error , Income was not added');
        else
          this.navCtrl.pop();
      });
  }
  }

  editCurrent() {
    if (this.isExpense){
    this.dbProvider.updateExpense(this.expense).then(data => {
      if (!data)
        this.showErrorMessage('Error , expense was not updated');
      else
        this.navCtrl.pop();
    });
  } else {
    this.dbProvider.updateIncome(this.expense).then(data => {
      if (!data)
        this.showErrorMessage('Error , Income was not updated');
      else
        this.navCtrl.pop();
    })
  }
  }

  cancel() {
    this.navCtrl.pop();
  }

  showErrorMessage(msg: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  getCaption(){
    let caption = "Add";
    if(this.edit)
    caption = "Save";
    return caption;
  }

  ionViewDidEnter() {
    if (this.dbReady)
      this.loadCategories();
  }

}
