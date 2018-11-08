import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite';
import { BehaviorSubject } from "rxjs/Rx";
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';
import { Category } from '../../models/Category';
import { Expense } from '../../models/Expense';
import { AppSettings } from '../../models/AppSettings';
import { Income } from '../../models/Income';


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
    let data = [null, category.name, category.details, category.icon, category.balance, category.is_expense];
    return this.database.executeSql("INSERT INTO `category` (id,name,details,icon,balance,is_expense) VALUES (?,?,?,?,?,?);", data)
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

  getCategories(isExpense: number) {
    return this.database.executeSql("select * from category  where is_expense =? order by id desc", [isExpense])
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
    return this.database.executeSql("Update `item` set category_id =?,title=?,hints=?,item_date=?,value=? WHERE id = ?", data)
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
          console.log("error getting expenses");
          return [];
        });
  }


  getPeriodValues(expense : boolean, type :string, value : string ) {
    let s = "";
    let table = 'income';
    if(expense)
    table = 'item';
    if(type=="week")
    s = " strftime('%Y-%W', item_date)";
    if(type=="month")
    s= "strftime('%Y-%m', item_date)";
    if(type=="day")
    s = "strftime('%Y-%m-%d', item_date)"
    return this.database.executeSql("select * from "+table+" where "+s+"=?", [value])
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
          console.log("error getting expenses");
          return [];
        });
  }
  /////////////////////////////////// expenses //////////////////////////////////////////////////////

  addIncome(item: Income) {
    let data = [null, item.category_id, item.title, item.hints, item.item_date, item.value];
    return this.database.executeSql("INSERT INTO `income` (id,category_id,title,hints,item_date,value) VALUES (?,?,?,?,?,?);", data)
      .then(data => {
        return data;
      },
        err => {
          console.log(JSON.stringify(err));
          return err;
        })
  }

  updateIncome(item: Income) {
    let data = [item.category_id, item.title, item.hints, item.item_date, item.value, item.id];
    return this.database.executeSql("Update `income` set category_id =?,title=?,hints=?,item_date=?,value=? WHERE id = ?", data)
      .then(data => {
        return data;
      },
        err => {
          console.log(JSON.stringify(err));
          return err;
        })
  }



  deleteIncome(expense: Income) {
    return this.database.executeSql("DELETE FROM `income` where id = ?", [expense.id])
      .then(data => {
        return data;
      },
        err => {
          console.log(JSON.stringify(err));
          return err;
        })
  }

  getIncomes(startDate: String, endDate: String) {
    return this.database.executeSql("select * from income where item_date between ? and ?", [startDate, endDate])
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
          console.log("error getting incomes");
          return [];
        });
  }

  ////////////////////////////// Settings ////////////////////////////////

  updateEmail(email: string) {

    return this.database.executeSql("UPDATE `settings`  Set user_email= ;", [email])
      .then(data => {
        return data;
      },
        err => {
          console.log(JSON.stringify(err));
          return err;
        })
  }

  updateSettings(settings: AppSettings) {
    let data = [settings.balance, settings.first_day, settings.language, settings.user_email];
    return this.database.executeSql("UPDATE `settings`  Set balance=?,first_day=?,language=?,user_email=?;", data)
      .then(data => {
        return data;
      },
        err => {
          console.log(JSON.stringify(err));
          return err;
        })
  }

  getSettings() {
    return this.database.executeSql("select * from settings ", [])
      .then(data => {
        let settings: any;
        if (data.rows.length > 0) {
          settings = data.rows.item(0);
        }
        return settings;
      },
        err => {
          console.log("error getting settings");
          return [];
        });
  }
  //////////////////////////// statistics ////////////////////////////////
  getTotalExpense(from: string, to: string) {
    return this.database.executeSql("select sum(value) as total from item where item_date between ? and ?", [from, to])
      .then(data => {
        console.log(JSON.stringify(data));
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

  getTotalCategoryExpense(from: string, to: string, id: number) {
    console.log(from);
    console.log(to);
    console.log(id);
    return this.database.executeSql("select sum(value) as total from item where category_id = ? and  item_date between ? and ?", [id, from, to])
      .then(data => {
        console.log(JSON.stringify(data));
        let total = -1;
        if (data.rows.length > 0) {
          total = data.rows.item(0)['total'];
          console.log(JSON.stringify(data.rows.item(0)));
        }
        console.log(total);
        return total;
      },
        err => {
          console.log("error getting category statistics");
          return -1;
        });
  }


  getMaxMinExpenseDates() {
    return this.database.executeSql('select max(item_date) as max_date , min(item_date) as min_date from item;').then((data) => {
      if (data.rows.length > 0) {
        let max_date = data.rows.item(0)['max_date'];
        let min_date = data.rows.item(0)['min_date'];
        console.log("min date is ",min_date);
        console.log("max date is ",max_date);
        return { max: max_date, min: min_date };
        
      }
    },
    err=>{
      console.log(JSON.stringify(err));
    }
    );
  }

  getPeriodicValues(expense : boolean ,type : string){
    let s = "";
    let table = 'income';
    if(expense)
    table = 'item';
    if(type=="week")
    s = " strftime('%Y-%W', item_date)";
    if(type=="month")
    s= "strftime('%Y-%m', item_date)";
    if(type=="day")
    s = "strftime('%Y-%m-%d', item_date)"
    return this.database.executeSql("select  "+ s+
    " as title, sum(value) as total from "+table+" GROUP BY  "+s+" order by "+s+" DESC limit 100",[]).then(data=>{
      let stats=[];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          let r = data.rows.item(i);
          stats.push(r);
        }
      }
      return stats;
    }).catch(reason=>{
     return null;
    });
  }

  
  getCategoricExpenses(from: string, to: string){
  
    return this.database.executeSql("select item.category_id,sum(value) as total, category.name  as title "+
    "  from item left join category on category.id=item.category_id  where  item_date between ? and ?"+
    " group by category_id", [from, to]).then(data=>{
      let stats=[];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          let r = data.rows.item(i);
          stats.push(r);
        }
      }
      return stats;
    }).catch(reason=>{
     return null;
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
