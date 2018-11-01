import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';
import { Category } from '../../models/Category';
import { DatabaseProvider } from '../../providers/database/database';
import { Expense } from '../../models/Expense';
@IonicPage()
@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  dbReady: boolean;
  loaded: boolean;
  currentItems: Category[];
  expenses: Expense[];
  public type : number;

  constructor(public navCtrl: NavController, private dbProvider: DatabaseProvider, public modalCtrl: ModalController) {
    this.dbProvider.getDatabaseState().subscribe(ready => {
      if (ready) {
        this.dbReady = true;
        if (!this.loaded) {
          this.loadCategories();
          this.loaded = true;
        }
        //this.addTestCategory();
      }
    })
  }
  loadCategories() {
    this.dbProvider.getCategories(this.type).then(data => {
      this.currentItems = data;
    });
  }

  setType(data :any){
    this.type = data;
    this.loadCategories();
  }

  addCategory() {
    this.navCtrl.push('AddCategoryPage',{expense : this.type});
  }
  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
  }


  ionViewDidEnter() {
    if (this.dbReady) {
        this.loadCategories();
        this.loaded = true;
    }
  }

  /**
   * Prompt the user to add a new item. This shows our ItemCreatePage in a
   * modal and then adds the new item to our data source if the user created one.
   */

  /**
   * Delete an item from the list of items.
   */
  deleteItem(category : Category) {
      this.dbProvider.deleteCategory(category).then(data=>{
          this.currentItems.splice(this.currentItems.indexOf(category),1);
      });
    }

    editItem(category : Category) {
      this.navCtrl.push('AddCategoryPage',{'cat':category,'edit':true});
    }
  /**
   * Navigate to the detail page for this item.
   */
  openItem(item: Category) {
    this.navCtrl.push('ItemDetailPage', {
      item: item
    });
  }
}
