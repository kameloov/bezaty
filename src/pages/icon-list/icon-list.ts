import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the IconListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-icon-list',
  templateUrl: 'icon-list.html',
})
export class IconListPage {
  iconList :String [] =['add','add-circle','alarm','albums','alert','american-football','home',
  'car','pizza','play',"aperture",'basket'];
  constructor(public navCtrl: NavController,public viewCtrl : ViewController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IconListPage');
  }

  select(icon: string) {
    this.viewCtrl.dismiss(icon);
  }
}
