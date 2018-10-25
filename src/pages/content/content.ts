import { Component } from '@angular/core';
import { IonicPage, NavController, Platform } from 'ionic-angular';
import { Stats } from '../../models/Stats';
import { DatabaseProvider } from '../../providers/database/database';
@IonicPage()
@Component({
  selector: 'page-content',
  templateUrl: 'content.html'
})
export class ContentPage {

  doughnutChartLabels: string[] = ['pent', 'remining'];
  doughnutChartData: number[] = [125, 300 - 125];
  doughnutChartType: string = 'doughnut';
  width:number=20;
  radius : number;
  daily : Stats;
  weekly : Stats;
  monthly : Stats;
  dbReady: boolean;

  constructor(public navCtrl: NavController, private dbProvider : DatabaseProvider, platform: Platform) {
    this.daily = new Stats();
    this.daily.setSpent(70);
    this.daily.setTotal(200);
    this.weekly = new Stats();
    this.weekly.setSpent(900);
    this.weekly.setTotal(1400);
    this.monthly = new Stats();
    this.monthly.setSpent(4800);
    this.monthly.setTotal(6000);
    dbProvider.getDatabaseState().subscribe((ready)=>{
      if (ready){
        this.dbReady = true;
        this.loadStatistics();
      }
    })
    platform.ready().then(res => {
      this.width= platform.width();
    });
  }

  loadStatistics(): any {
    if (this.dbReady){
       this.dbProvider.getTotalExpense("2018-10-24","2018-10-24").then((spent)=>{
        this.daily.setSpent(spent);
       });

       this.dbProvider.getTotalExpense("2018-10-20","2018-10-24").then((spent)=>{
        this.weekly.setSpent(spent);
       });

       this.dbProvider.getTotalExpense("2018-10-01","2018-10-24").then((spent)=>{
        this.monthly.setSpent(spent);
       });
    }

   
  }

  // events

  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

}
