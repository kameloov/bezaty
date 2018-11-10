import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, Loading } from 'ionic-angular';
import { Stats } from '../../models/Stats';
import { DatabaseProvider } from '../../providers/database/database';
import { Settings } from '../../providers';
@IonicPage()
@Component({
  selector: 'page-content',
  templateUrl: 'content.html'
})

export class ContentPage {

  width: number = 20;
  radius: number;
  daily: Stats;
  weekly: Stats;
  monthly: Stats;
  dbReady: boolean;
  total: number;
  public loading : boolean;
  public fromWeek : string;
  public fromMonth : string;
  public to :string;

  constructor(public navCtrl: NavController, private dbProvider: DatabaseProvider,
    public settings: Settings, platform: Platform) {
      this.loading = true;
      this.daily = new Stats();
      this.weekly = new Stats();
      this.monthly = new Stats();
    //  this.refreshValues();
    platform.ready().then(res => {
      this.width = platform.width();
    });
  }

  private refreshValues() {
    this.loading = true;
    this.dbProvider.getDatabaseState().subscribe((ready) => {
      if (ready) {
        this.dbReady = true;
        this.loadStatistics();
       } else 
        this.loading = false;

    })
  }

  private getDaysCount(): number {
    let d = new Date();
    let days = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    return days;
  }

  loadStatistics(): any {

    if (this.dbReady) {
      this.dbProvider.getSettings().then((data)=>{
        this.total = data.balance;
        let perDay = this.total / this.getDaysCount();
        this.daily.setTotal(perDay);
        this.weekly.setTotal(perDay * 7);
        this.monthly.setTotal(this.total);
      })
      let d = new Date();
      this.to = this.dateTostr(d);
      this.dbProvider.getTotalExpense(this.to, this.to).then((spent) => {
        this.daily.setSpent(spent ? spent : 0);
      });
      this.fromWeek = this.dateTostr(new Date(d.getFullYear(),d.getMonth(),d.getDate()-7));
      this.dbProvider.getTotalExpense(this.fromWeek,this.to).then((spent) => {
        this.weekly.setSpent(spent ? spent : 0);
      });
      this.fromMonth = this.dateTostr(new Date(d.getFullYear(),d.getMonth(),1));
      this.dbProvider.getTotalExpense(this.fromMonth, this.to).then((spent) => {
        this.monthly.setSpent(spent ? spent : 0);
      });
    }


  }

  public showMonthStatistics() {
    this.navCtrl.push('StatisticsPage', { fromDate: this.fromMonth, toDate:this.to});
  }

  public showDayStatistics() {
    this.navCtrl.push('StatisticsPage', { fromDate: this.to, toDate: this.to});
  }
  public showWeekStatistics() {
    this.navCtrl.push('StatisticsPage', { fromDate: this.fromWeek, toDate: this.to });
  }

 showAdd(is_expense : boolean){
  this.navCtrl.push("AddExpensePage",{is_expense :is_expense})
 }

 showCategories(){
   this.navCtrl.push('ListMasterPage');
 }
  
  ionViewDidEnter() {
    this.refreshValues();
  }


  dateTostr(date : Date){
    return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
  }

}
