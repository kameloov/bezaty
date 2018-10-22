import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
import { Category } from '../../models/Category';
import { DatabaseProvider } from '../../providers/database/database';

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
  constructor(public navCtrl: NavController, private modalCtrl: ModalController, private toastCtrl: ToastController, private dbProvider: DatabaseProvider, public navParams: NavParams) {
    if (this.navParams.get('edit')) {
      this.category = this.navParams.get('cat');
      this.edit = this.navParams.get('edit');
    } else
      this.category = new Category();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddCategoryPage');
  }
  addCategory() {
    if (!this.category.balance || !this.category.name || !this.category.icon) {
      this.showErrorMessage('please make sure to select an icon and fill the missing fields');
      return;
    }
    if (this.edit)
      this.editCurrent();
     else
      this.addNew();
  }


  getCaption(){
    let caption = "Add";
    if(this.edit)
    caption = "Save";
    return caption;
  }

  addNew() {
    this.dbProvider.addCategory(this.category).then(data => {
      if (!data)
        this.showErrorMessage('Error , category was not added');
      else
        this.navCtrl.pop();
    });
  }

  editCurrent() {
    this.dbProvider.updateCategory(this.category).then(data => {
      if (!data)
        this.showErrorMessage('Error , category was not updated');
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
