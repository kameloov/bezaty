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
  constructor(public navCtrl: NavController, private toastCtrl: ToastController, private dbProvider: DatabaseProvider, public navParams: NavParams) {

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
    this.dbProvider.getCategories().then(data => {
      this.categories = data;
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
    this.dbProvider.addExpense(this.expense).then(data => {
      if (!data)
        this.showErrorMessage('Error , expense was not added');
      else
        this.navCtrl.pop();
    });
  }

  editCurrent() {
    this.dbProvider.updateExpense(this.expense).then(data => {
      if (!data)
        this.showErrorMessage('Error , expense was not updated');
      else
        this.navCtrl.pop();
    });
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
