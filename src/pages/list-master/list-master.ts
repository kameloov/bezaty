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
  public shownBefore :boolean;

  constructor(public navCtrl: NavController, private dbProvider: DatabaseProvider, public modalCtrl: ModalController) {
   this.type = "1";
    this.dbProvider.getDatabaseState().subscribe(ready => {
      if (ready) {
        this.dbReady = true;
        this.dbProvider.getSettings().then(data=>{
          this.settings = data;
        });
        if (!this.loaded) {
          this.loadCategories();
          this.getHintShown();
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



  getHintShown(){
    this.dbProvider.hintShown().then(shown=>{
      this.shownBefore = shown;
    })
  }


  ionViewDidEnter() {
    setTimeout(()=>{
      if (this.shouldShowHint()){
        this.shownBefore = true;
        this.dbProvider.setHintShown();
      }
    },2500);
    
    if (this.dbReady) {
      this.loaded = true;
        this.loadCategories();
      this.getHintShown();
    }
  }

  shouldShowHint(){
    return ( this.currentItems && this.currentItems.length>0 && !this.shownBefore)
  }
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
    
}
