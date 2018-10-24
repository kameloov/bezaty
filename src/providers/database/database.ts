import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite';
import { BehaviorSubject } from "rxjs/Rx";
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';
import { Category } from '../../models/Category';
import { Expense } from '../../models/Expense';


/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseProvider {


  private database: SQLiteObject;
  private databaseReady: BehaviorSubject<Boolean>;

  constructor(public http: Http, private sqlitePorter: SQLitePorter,
    private storage: Storage, private Sqlite: SQLite, private platform: Platform) {
    this.databaseReady = new BehaviorSubject(false);
    this.platform.ready().then(() => {
      console.log("device ready");
      this.Sqlite.create({
        name: 'finance.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          console.log("got db");
          this.database = db;
          this.storage.get('database_filled').then(val => {
            if (val) {
              console.log("db lready filled");
              this.databaseReady.next(true);
            } else {
              console.log("filling db");
              this.fillDB();
            }
          });
        });
    });
  }

  getDatabaseState() {
    return this.databaseReady.asObservable();

  }
  fillDB() {
    this.http.get('assets/finance.db')
      .map(res => res.text())
      .subscribe(sql => {
        console.log("preparing to import");
        this.sqlitePorter.importSqlToDb(this.database, sql)
          .then(data => {
            console.log("database us ready ");
            this.databaseReady.next(true);
            this.storage.set('database_filled', true);
          })
      }, err => {
        console.log(err);
      })
  }

  addCategory(category: Category) {
    let data = [null, category.name, category.details, category.icon, category.balance];
    return this.database.executeSql("INSERT INTO `category` (id,name,details,icon,balance) VALUES (?,?,?,?,?);", data)
      .then(data => {
        return data;
      },
        err => {
          console.log(JSON.stringify(err));
          return err;
        })
  }

  updateCategory(category: Category) {
    let data = [category.name, category.details, category.icon, category.balance, category.id];
    return this.database.executeSql("UPDaTE `category`  Set name=?,details=?,icon=?,balance=? WHERE id = ?;", data)
      .then(data => {
        return data;
      },
        err => {
          console.log(JSON.stringify(err));
          return err;
        })
  }

  getCategories() {
    return this.database.executeSql("select * from category order by id desc", [])
      .then(data => {
        //console.log(data);
        let categories = [];
        if (data.rows.length > 0) {

          for (var i = 0; i < data.rows.length; i++) {
            let category = data.rows.item(i);
            categories.push(category);
          }
        }
        return categories;
      },
        err => {
          console.log("error getting categories");
          return [];
        });
  }

  deleteCategory(category: Category) {
    return this.database.executeSql("DELETE FROM `category` where id = ?", [category.id])
      .then(data => {
        return data;
      },
        err => {
          console.log(JSON.stringify(err));
          return err;
        })
  }

  /////////////////////////////////// expenses //////////////////////////////////////////////////////

  addExpense(item: Expense) {
    let data = [null, item.category_id, item.title, item.hints, item.item_date, item.value];
    return this.database.executeSql("INSERT INTO `item` (id,category_id,title,hints,item_date,value) VALUES (?,?,?,?,?,?);", data)
      .then(data => {
        return data;
      },
        err => {
          console.log(JSON.stringify(err));
          return err;
        })
  }

  updateExpense(item: Expense) {
    let data = [item.category_id, item.title, item.hints, item.item_date, item.value, item.id];
    return this.database.executeSql("Update `item` set category_id=?,title=?,hints=?,item_date=?,value=? WHERE id = ?", data)
      .then(data => {
        return data;
      },
        err => {
          console.log(JSON.stringify(err));
          return err;
        })
  }



  deleteExpense(expense: Expense) {
    return this.database.executeSql("DELETE FROM `item` where id = ?", [expense.id])
      .then(data => {
        return data;
      },
        err => {
          console.log(JSON.stringify(err));
          return err;
        })
  }

  getExpenses(startDate: String, endDate: String) {
    return this.database.executeSql("select * from item where item_date between ? and ?", [startDate, endDate])
      .then(data => {
        //console.log(data);
        let expenses = [];
        if (data.rows.length > 0) {

          for (var i = 0; i < data.rows.length; i++) {
            let category = data.rows.item(i);
            expenses.push(category);
          }
        }
        return expenses;
      },
        err => {
          console.log("error getting categories");
          return [];
        });
  }

  //////////////////////////// statistics ////////////////////////////////
  getTotalExpense(from: string, to: string) {
    return this.database.executeSql("select sum(value) as total from item where item_date between ? and ?", [from, to])
      .then(data => {
        console.log(data);
        let total = -1;
        if (data.rows.length > 0) {
          total = data.rows.item(0)['total'];
        }
        return total;
      },
        err => {
          console.log("error getting statisitics");
          return -1;
        });
  }

  getTotalCategoryExpense(from: string, to: string,id : number) {
    return this.database.executeSql("select sum(value) as total from item where id = ? and  item_date between ? and ?", [id,from, to])
      .then(data => {
        console.log(data);
        let total = -1;
        if (data.rows.length > 0) {
          total = data.rows.item(0)['total'];
        }
        return total;
      },
        err => {
          console.log("error getting category statistics");
          return -1;
        });
  }
  ////////////////////////// export database ////////////////////////////

  exportDatabase() {
    return this.sqlitePorter.exportDbToSql(this.database)
      .then(data => {
        console.log(data);
      },
        err => {
          console.log(err);
        })
  }
}
