'use strict';

const sqlite = require('sqlite3');
const dayjs = require('dayjs');

const db = new sqlite.Database('db.sqlite', (err) => {
    if(err) throw err;
});

function configureCounter(counter) {
    return new Promise((resolve, reject) => {
      const sql =
        "INSERT INTO counterStats(service, counter, date, number) VALUES(?,?,?,?)";
      db.run(
        sql,
        [counter.service, counter.counterId, counter.date, counter.number],
        (err) => {
          if (err) reject(err.message);
          else resolve(true);
        }
      );
      const sql2 =
        "INSERT INTO servicesByCounter(counter, service) VALUES(?,?)";
      db.run(
        sql2,
        [counter.counterId, counter.service],
        (err) => {
          if (err) reject(err.message);
          else resolve(true);
        }
      );
    });
  }

exports.listPages = () =>{
    return new Promise((resolve, reject) => {
        const sql = 'SELECT P.id, P.title, P.creationDate, P.publicationDate, U.username FROM pages P, users U WHERE P.userId = U.id AND P.publicationDate <= CURRENT_DATE';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const pages = rows.map((e) => ({ id: e.id, title: e.title, publicationDate: dayjs(e.publicationDate),  author: e.username }));
            resolve(pages);
        });
    });
};

exports.configureCounter = configureCounter;