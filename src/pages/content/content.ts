import { Component } from '@angular/core';
import { IonicPage, NavController, Platform } from 'ionic-angular';
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

  constructor(public navCtrl: NavController, private dbProvider: DatabaseProvider,
    public settings: Settings, platform: Platform) {
      this.daily = new Stats();
      this.weekly = new Stats();
      this.monthly = new Stats();
      this.refreshValues();
    platform.ready().then(res => {
      this.width = platform.width();
    });
  }


  private refreshValues() {
     this.settings.getSettings().then((data=>{
      this.total =data.balance;
    }));
    let perDay = this.total / this.getDaysCount();
    this.daily.setTotal(perDay);
    this.weekly.setTotal(perDay * 7);
    this.monthly.setTotal(this.total);
    this.dbProvider.getDatabaseState().subscribe((ready) => {
      if (ready) {
        this.dbReady = true;
        this.loadStatistics();
      }
    })

  }

  private getDaysCount(): number {
    let d = new Date();
    let days = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    return days;
  }

  loadStatistics(): any {

    if (this.dbReady) {
      this.dbProvider.getTotalExpense("2018-10-24", "2018-10-24").then((spent) => {
        this.daily.setSpent(spent ? spent : 0);
      });

      this.dbProvider.getTotalExpense("2018-10-20", "2018-10-24").then((spent) => {
        this.weekly.setSpent(spent ? spent : 0);
      });

      this.dbProvider.getTotalExpense("2018-10-01", "2018-10-24").then((spent) => {
        this.monthly.setSpent(spent ? spent : 0);
      });
    }


  }

  showMonthStatistics() {
    this.navCtrl.push('StatisticsPage', { fromDate: '2018-10-01', toDate: '2018-10-25' });
  }

  // events

  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  
  ionViewDidEnter() {
    this.refreshValues();
  }


}
