import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { Category } from '../../models/Category';

/**
 * Generated class for the StatisticsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-statistics',
  templateUrl: 'statistics.html',
})
export class StatisticsPage {

  dbReady: boolean;
  loaded: boolean;
  categories: Category[];
  fromDate : string  = '2018-10-01';
  toDate : string  = '2018-10-25';

  constructor(public navCtrl: NavController, public navParams: NavParams, private dbProvider: DatabaseProvider) {
    //this.fromDate = navParams.get('fromDate');
    //this.toDate = navParams.get('toDate');
    this.dbProvider.getDatabaseState().subscribe(ready => {
      if (ready) {
        this.dbReady = true;
        if (!this.loaded) {
          this.loadCategories();
          this.loaded = true;
        }

      }
    })
  }

  loadCategories() {
    this.dbProvider.getCategories().then(data => {
      this.categories = data;
      if (this.categories){
        this.categories.forEach(element => {
          this.getSpentAmount(element);
        });
      }
    });
  }

  getSpentAmount(category : Category){
    if (this.dbReady){
      this.dbProvider.getTotalCategoryExpense(this.fromDate,this.toDate,category.id).then((total)=>{
        category.spent = total;
      })
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StatisticsPage');
  }

  ionViewDidEnter() {
    if (this.dbReady) {
        this.loadCategories();
        this.loaded = true;
    }
  }
}
