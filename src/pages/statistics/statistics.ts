import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';

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
  data: any[];
  fromDate: string = '2018-5-01';
  toDate: string = '2018-11-07';
  public chartData: any = [{ data: [0, 0, 0, 0], label: "daily" }];
  public chartLabels: any;
  public loading: boolean
  public empty: boolean;
  public width: number = 0;
  public height: number = 0;
  public chartType :string = 'bar';

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform,
    private dbProvider: DatabaseProvider) {
    this.fromDate = navParams.get('fromDate');
    this.toDate = navParams.get('toDate');
    platform.ready().then(res => {
      this.width = platform.width();
      this.height = platform.height();
    });
    this.dbProvider.getDatabaseState().subscribe(ready => {
      if (ready) {
        this.dbReady = true;
        /* if (!this.loaded) {
          this.getData();
          this.loaded = true;
        } */

      }
    })
  }


  getData() {
    if (this.dbReady) {
      this.loading = true;
      this.dbProvider.getCategoricExpenses(this.fromDate, this.toDate).then((result) => {
        this.data = result;
        console.log(JSON.stringify(this.data));
        this.extractChartData();
        this.extractChartLabes();
        this.loading = false;
      })
    }
  }

  extractChartData() {
    let values = [];
    this.data.forEach(element => {
      values.push(element.total);
    });
    this.chartData = [{ label: "daily", data: values }];
  }


  extractChartLabes() {
    let values = [];
    this.data.forEach(element => {
      values.push(element.title);
    });
    this.chartLabels = values;
  }

  public ChartOptions: any = {
    responsive: true
  };

  ionViewDidLoad() {
    console.log('ionViewDidLoad statistics page ');
  }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }
  ionViewDidEnter() {
    if (this.dbReady) {
      this.getData();
      this.loaded = true;
    }
  }
}
