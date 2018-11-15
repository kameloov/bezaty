import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Expense } from '../../models/Expense';
import { Category } from '../../models/Category';
import { DatabaseProvider } from '../../providers/database/database';
import { TranslateService } from '@ngx-translate/core';

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
  category_alert_text : string;
  category_alert_title : string;
  yes_btn : string;
  no_btn : string;
  
  constructor(public navCtrl: NavController, public toastCtrl: ToastController,public translate : TranslateService,
     public dbProvider: DatabaseProvider, public navParams: NavParams,public alertCtrl : AlertController) {
    this.getTranslation();
      this.isExpense = navParams.get('is_expense');
    this.title = this.isExpense ? 'Add expense ': 'Add income ';
    this.edit = this.navParams.get('edit');
    translate.get(this.edit?'EDIT':'ADD').subscribe(value=>{
      this.title = value;
    })
    if (this.edit) {
      this.expense = navParams.get('exp');
    } else {
      this.expense = new Expense();
      let d = new Date();
      
      this.expense.item_date = d.toISOString();
    }
    this.categories = [];
    this.dbProvider.getDatabaseState().subscribe(ready => {
      if (ready) {
        this.dbReady = true;
        this.loadCategories();
      }
    })
  }

  getTranslation(){
    let keys = ['NO_CATEGORY_MSG','ALERT','SHOW_CATEGORY','CANCEL_BUTTON'];
      this.translate.get(keys).subscribe(res=>{
        this.category_alert_title = res[keys[1]];
        this.category_alert_text = res[keys[0]];
        this.yes_btn = res[keys[2]];
        this.no_btn = res[keys[3]];
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
    this.expense.item_date = this.expense.item_date.split('T')[0];
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

  ionViewDidEnter() {
    if (this.dbReady)
      this.loadCategories();
  }

  showCategoryAlert(){
    let alert = this.alertCtrl.create({
      title: this.category_alert_title,
      message: this.category_alert_text,
      buttons: [
        {
          text: this.yes_btn,
          role: 'cancel',
          handler: () => {
          
          }
        },
        {
          text: this.no_btn,
          handler: () => {
            this.navCtrl.push('ListMasterPage');
          }
        }
      ]
    });
    alert.present();
  }
}
