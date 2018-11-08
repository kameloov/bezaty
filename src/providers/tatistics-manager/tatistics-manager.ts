import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../database/database';

/*
  Generated class for the TatisticsManagerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TatisticsManagerProvider {
  dbReady : Boolean;
  constructor(public dbProvider : DatabaseProvider) {
    console.log('Hello TatisticsManagerProvider Provider');
    dbProvider.getDatabaseState().subscribe(ready=>{
      this.dbReady = ready;
    })
  };

}
