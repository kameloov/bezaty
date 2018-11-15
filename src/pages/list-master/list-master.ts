import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';
import { Category } from '../../models/Category';
import { DatabaseProvider } from '../../providers/database/database';
import { Expense } from '../../models/Expense';
import { AppSettings } from '../../models/AppSettings';
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
  public type :any;
  settings : AppSettings;

  constructor(public navCtrl: NavController, private dbProvider: DatabaseProvider, public modalCtrl: ModalController) {
   this.type = "1";
    this.dbProvider.getDatabaseState().subscribe(ready => {
      if (ready) {
        this.dbReady = true;
        this.dbProvider.getSettings().then(data=>{
          this.settings = data;
        })
        if (!this.loaded) {
          this.loadCategories();
          this.loadStatistics();
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

   public setKind(value) {
    console.log(value);
    this.loadCategories();
  }

  addCategory() {
    this.navCtrl.push('AddCategoryPage',{expense : this.type,  curId : this.settings.curr});
  }
  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
  }

  loadStatistics(){
    this.dbProvider.getCategoricExpenses("2018-08-01","2018-11-07").then(data => {
      console.log(JSON.stringify(data));
    });
  }

  ionViewDidEnter() {

    if (this.dbReady) {
      this.loaded = true;
        this.loadCategories();
       this.loadStatistics();
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
      this.navCtrl.push('AddCategoryPage',{'cat':category,'edit':true,curId:this.settings.curr});
    }
  /**
   * Navigate to the detail page for this item.
   */
  openItem(item: Category) {
  /*   this.navCtrl.push('ItemDetailPage', {
      item: item
    }); */
  }
  
}
