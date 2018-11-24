import { Component, keyframes, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, Platform, Select } from 'ionic-angular';
import { Expense } from '../../models/Expense';
import { Category } from '../../models/Category';
import { DatabaseProvider } from '../../providers/database/database';
import { TranslateService } from '@ngx-translate/core';
import { Currency } from '../../models/Currency';
import { Subscription } from 'rxjs';

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
  public suggestions : History[];
  dbReady: boolean;
  edit: boolean;
  public isExpense: boolean;
  public title: string;
  category_alert_text: string;
  category_alert_title: string;
  yes_btn: string;
  no_btn: string;
  public right: boolean = false;
  public currency: Currency;
  public curId : number;
  public editing:boolean;
  public suggestion : string;
  dbSub :Subscription;
  @ViewChild (Select) select : Select;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController,
    public translate: TranslateService, public platform: Platform,
    public dbProvider: DatabaseProvider, public navParams: NavParams, public alertCtrl: AlertController) {
    this.getTranslation();
    console.log(JSON.stringify(navParams));
    this.suggestions = [];
    this.curId = navParams.get('curId');
    this.currency = new Currency();
    this.dbProvider.getDatabaseState().subscribe(ready=>{
      if (ready)
      this.getCurrency();
    })
    this.isExpense = navParams.get('is_expense');
    this.title = this.isExpense ? 'Add expense ' : 'Add income ';
    this.edit = this.navParams.get('edit');
    translate.get(this.edit ? 'EDIT' : 'ADD').subscribe(value => {
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
  }

  getTranslation() {
    let keys = ['NO_CATEGORY_MSG', 'ALERT', 'SHOW_CATEGORY', 'CANCEL_BUTTON'];
    this.translate.get(keys).subscribe(res => {
      this.category_alert_title = res[keys[1]];
      this.category_alert_text = res[keys[0]];
      this.yes_btn = res[keys[2]];
      this.no_btn = res[keys[3]];
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddExpensePage');
  }

  public isFuture(){
    let d = new Date();
    let  v =new Date(Date.parse(this.expense.item_date)); 
    return (v>d);
  }

  loadCategories() {
    this.dbProvider.getCategories(this.isExpense ? 1 : 0).then(data => {
      this.categories = data;
      if (!data || data.length == 0)
        this.showCategoryAlert();
      console.log("categories", JSON.stringify(data));
    });
  }
  addExpense() {
    if (!this.expense.title || !this.expense.category_id || !this.expense.value) {
      this.showTranslatedMessage('FILL_EMPTY');
      return;
    }
    this.addSuggestion();
    if (this.edit)
      this.editCurrent();
    else
      this.addNew();
  
  }

  public openSugestion(ev){
    if(this.expense.title.length>1){
    this.getSuggestions();
    this.editing= true;
    }
    else
    this.editing = false;

  }
  addSuggestion(){
    if(!this.expense.title)
    return;
    this.dbProvider.addHistory(this.expense.title).then(data=>{
      console.log(JSON.stringify(data));
    });
  }
  addNew() {
    this.expense.item_date = this.expense.item_date.split('T')[0];
    if (this.isExpense) {
      this.dbProvider.addExpense(this.expense).then(data => {
        if (!data)
          this.showTranslatedMessage('ADD_ERROR');
        else
          this.navCtrl.pop();
      });
    } else {
      this.dbProvider.addIncome(this.expense).then(data => {
        if (!data)
          this.showTranslatedMessage('ADD_ERROR');
        else
          this.navCtrl.pop();
      });
    }
  }

  editCurrent() {
    if (this.isExpense) {
      this.dbProvider.updateExpense(this.expense).then(data => {
        if (!data)
          this.showTranslatedMessage('EDIT_ERROR');
        else
          this.navCtrl.pop();
      });
    } else {
      this.dbProvider.updateIncome(this.expense).then(data => {
        if (!data)
          this.showTranslatedMessage('EDIT_ERROR');
        else
          this.navCtrl.pop();
      })
    }
  }

  cancel() {
    this.navCtrl.pop();
  }

  showTranslatedMessage(key: string) {
    this.showErrorMessage(this.translate.instant(key));
  }

  showErrorMessage(msg: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  public selectSuggestion(s:string){
    this.expense.title = s;
    this.editing = false;
  }
  public getSuggestions(){
    this.dbProvider.getHistory(this.expense.title).then(data=>{
      console.log(JSON.stringify(data));
      if (data)
      this.suggestions = data
      else
      this.suggestions = [];
    })
  }

  ionViewDidEnter() {
    this.right = this.platform.dir() == 'rtl';
    console.log('direction', this.right);
    this.dbSub=this.dbProvider.getDatabaseState().subscribe(ready => {
      if (ready) {
        this.dbReady = true;
        this.loadCategories();
        this.getCurrency();
      }
    })
  }

  ionViewDidLeave(){
    
    if (this.dbSub)
    this.dbSub.unsubscribe();
  }

  getCurrency() {
    this.dbProvider.getCurrencyByID(this.curId).then(data => {
      console.log('currency', JSON.stringify(data));
      if (data)
      this.currency = data;
    }).catch(err => {
      console.log(err);
    })
  }

  showCategoryAlert() {
    let alert = this.alertCtrl.create({
      title: this.category_alert_title,
      message: this.category_alert_text,
      buttons: [
        {
          text: this.no_btn,
          role: 'cancel',
          handler: () => {

          }
        },
        {
          text: this.yes_btn,
          handler: () => {
            this.navCtrl.push('ListMasterPage');
          }
        }
      ]
    });
    alert.present();
  }
}
