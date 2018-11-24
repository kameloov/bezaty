import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController, Platform } from 'ionic-angular';
import { Category } from '../../models/Category';
import { DatabaseProvider } from '../../providers/database/database';
import { Currency } from '../../models/Currency';
import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the AddCategoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-add-category',
  templateUrl: 'add-category.html',
})
export class AddCategoryPage {
  category: Category;
  edit: boolean;
  curId: number;
  public currency: Currency;
  title: string;
  empty: string;
  public right : boolean = false ;

  constructor(public navCtrl: NavController, private modalCtrl: ModalController,
     public translate: TranslateService,public platform : Platform,
    private toastCtrl: ToastController, private dbProvider: DatabaseProvider, public navParams: NavParams) {
    console.log(JSON.stringify(navParams));
    this.curId = navParams.get('curId');
    this.currency = new Currency();
    this.right = platform.dir()=='rtl';
    dbProvider.getDatabaseState().subscribe(ready => {
      if (ready) {
        dbProvider.getCurrencyByID(this.curId).then(data => {
          console.log('currency', JSON.stringify(data));
          this.currency = data;
        }).catch(err => {
          console.log(err);
        })
      }
    })
    if (this.navParams.get('edit')) {
      this.category = this.navParams.get('cat');
      this.edit = this.navParams.get('edit');
    } else {
      this.category = new Category();
      this.category.is_expense = this.navParams.get('expense');
    }
    this.getTitle();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddCategoryPage');
  }
  addCategory() {
    if (!this.category.balance || !this.category.name || !this.category.icon) {
      this.showErrorMessage(this.empty);
      return;
    }
    if (this.edit)
      this.editCurrent();
    else
      this.addNew();
  }

  addNew() {
    this.dbProvider.addCategory(this.category).then(data => {
      if (!data)
      this.showErrorMessage(this.translate.instant('ADD_FAILED'));
      else
        this.navCtrl.pop();
    });
  }


  getTitle() {
    this.translate.get(this.edit ? 'EDIT' : 'ADD').subscribe(data => {
      this.title = data;
    })
    this.translate.get('NO_CATEGORIES').subscribe(data => {
      this.empty = data;
    })
  }

  editCurrent() {
    this.dbProvider.updateCategory(this.category).then(data => {
      if (!data)
        this.translate.get('ADD_FAIL').subscribe(data => {
          this.showErrorMessage(data);
        })
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

  showIcons() {
    let addModal = this.modalCtrl.create('IconListPage');
    addModal.onDidDismiss(item => {
      if (item) {
        this.category.icon = item;
      }
    });
    addModal.present();
  }
}
