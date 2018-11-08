import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';

/**
 * Generated class for the PeriodicChartsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-periodic-charts',
  templateUrl: 'periodic-charts.html',
})
export class PeriodicChartsPage {

  dbReady: boolean;
  loaded: boolean;
  public loading: boolean
  public empty: boolean;
  public periodic: any[];
  public section: string = 'day';
  public chartData: any = [{ data: [0, 0, 0, 0], label: "" }];
  public chartLabels: any;
  public width: number = 0;
  public height: number = 0;
  public chartType: string = 'bar';
  public is_expense: boolean;


  constructor(public navCtrl: NavController, public platform: Platform, public navParams: NavParams, public dbProvider: DatabaseProvider) {
    //t/his.section = navParams.get('section');
    this.is_expense = navParams.get('is_expense');
    platform.ready().then(res => {
      this.width = platform.width();
      this.height = platform.height();
      console.log("h:w", this.height + ":" + this.width)
      this.dbProvider.getDatabaseState().subscribe(ready => {
        if (ready) {
          this.dbReady = true;
          if (!this.loaded) {
            this.loadData(this.section);
          }
        }
      })
    });

  }

  public loadData(section: string) {
    this.loading = true;
    if (this.dbReady) {
      this.dbProvider.getPeriodicValues(this.is_expense, section).then(data => {
        if (data) {
          console.log(JSON.stringify(data));
          this.periodic = data;
          this.extractChartData();
          this.extractChartLabes();
        }
        else
          this.empty = true;
        this.loading = false;
      }, err => {
        this.empty = true;
        this.loading = false;
      })
    }
  }

  extractChartData() {
    let values = [];
    this.periodic.forEach(element => {
      values.push(element.total);
    });
    this.chartData = [{ label: this.section, data: values }];
  }


  extractChartLabes() {
    let values = [];
    this.periodic.forEach(element => {
      values.push(element.title);
    });
    this.chartLabels = values;
  }

  public lineChartOptions: any = {
    responsive: true
  };

  ionViewDidLoad() {
    console.log('ionViewDidLoad PeriodicChartsPage');
  }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }
}
