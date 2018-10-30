import { Injectable } from '@angular/core';
import { AppSettings } from '../../models/AppSettings';
import { DatabaseProvider } from '../database/database';

/**
 * A simple settings/config class for storing key/value pairs with persistence.
 */
@Injectable()
export class Settings {
  settings: AppSettings;
  dbReady: boolean;

  constructor(public dbProvider :DatabaseProvider) {
    this.dbProvider.getDatabaseState().subscribe(ready => {
      if (ready) {
        this.dbReady = true;
        this.loadSettings();
      }
    })

  }

  private loadSettings() {
    return this.dbProvider.getSettings().then(data => {
      this.settings = data;
    });
  }

  public getSettings():AppSettings {
    if (this.dbReady)
    return this.settings;
  }

  public saveSettings(settings : AppSettings){
    this.dbProvider.updateSettings(settings);
    this.settings = settings;
  }

}
