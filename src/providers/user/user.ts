import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';

import { Api } from '../api/api';
import { Account } from '../../models/Account';
import { DatabaseProvider } from '../database/database';

/**
 * Most apps have the concept of a User. This is a simple provider
 * with stubs for login/signup/etc.
 *
 * This User provider makes calls to our API at the `login` and `signup` endpoints.
 *
 * By default, it expects `login` and `signup` to return a JSON object of the shape:
 *
 * ```json
 * {
 *   status: 'success',
 *   user: {
 *     // User fields your app needs, like "id", "name", "email", etc.
 *   }
 * }Ø
 * ```
 *
 * If the `status` field is not `success`, then an error is detected and returned.
 */
@Injectable()
export class User {
  _user: any;

  constructor(public api: Api, public db: DatabaseProvider) { }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  login(accountInfo: Account) {
    let seq = this.api.post('users/login', accountInfo).share();
    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      if (res.success == 1) {
        this._user = res.data[0];
        console.log('updating user email ', accountInfo.email);
        this.db.setLogged(true);
        if (!this.isLastLoggedUser(accountInfo)) {
          console.log('not last logged user');
          this.db.resetDb();
          this.db.updateEmail(this._user.email, this._user.name);
     /*      this.db.getDatabaseState().subscribe(ready => {
            if (ready) {
              this.db.updateEmail(this._user.email, this._user.name);
            }
          }) */
        } else {
          console.log(' last logged user');
          this.db.updateEmail(this._user.email, this._user.name);
        }
      } 
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  sendResetCode(mail: string) {
    let c = Math.floor(Math.random() * 9000 + 1000);
    let req = this.api.post('reset/password', { email: mail, code: c }).share();
    return req;
  }

  resetPassword(mail: string, pass: string) {
    return this.api.post('upate/password', { email: mail, passwor: pass });

  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(accountInfo: Account, lang: number) {
    let seq = this.api.post('users/register', accountInfo).share();
    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      if (res.success == 1) {
        this.db.setLogged(true);
        this.db.fillDB();
        accountInfo.id = res.data;
        this._user = accountInfo;
        this.db.getDatabaseState().subscribe(ready => {
          if (ready) {
            this.db.updateEmailLang(accountInfo.email, accountInfo.name, lang);
          }
        })
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  isLastLoggedUser(u: Account): any {
    this.db.getSettings().then(data => {
      return (data.user_email == u.email);
    })
  }

  /**
   * Log the user out, which forgets the session
   */
  logout() {
    this._user = null;
  }

  isFirstUse() {

  }

}
