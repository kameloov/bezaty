import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
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
  constructor(public navCtrl: NavController, private toastCtrl: ToastController, private dbProvider: DatabaseProvider, public navParams: NavParams) {
    if (this.navParams.get('cat'))
      this.category = this.navParams.get('cat');
    else
      this.category = new Category();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddCategoryPage');
  }
  addCategory() {
    this.dbProvider.addCategory(this.category).then(data => {
      if (!data)
        this.showErrorMessage;
    });
  }
  showErrorMessage() {
    let toast = this.toastCtrl.create({
      message: "Error , faield to add category",
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
}
