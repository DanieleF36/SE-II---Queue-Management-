'use strict';

//ciao

const sqlite = require('sqlite3');
const dayjs = require('dayjs');

const db = new sqlite.Database('db.sqlite', (err) => {
    if(err) throw err;
});

exports.listServices = () =>{
    return new Promise((resolve, reject) => {
        const sql = 'SELECT S.name, S.averageTime FROM service S ';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const pages = rows.map((e) => ({name: e.name, averageTime: e.averageTime}));
            resolve(pages);
        });
    });
};

exports.listServicesByCounter = (id) =>{
    return new Promise((resolve, reject) => {
        const sql = 'SELECT S.service FROM servicesByCounter S WHERE S.counter = ?';
        db.all(sql, [id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const pages = rows.map((e) => ({service: e.service}));
            resolve(pages);
        });
    });
};

exports.addServiceToCounter = (counterId, serviceName) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO servicesByCounter(counter, service) VALUES (?,?)';
        db.run(sql, [counterId, serviceName], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

exports.removeServiceToCounter = (counterId, serviceName) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM servicesByCounter S WHERE S.counter = ? AND service = ?';
        db.run(sql, [counterId, serviceName], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}
//dateType is a number used to distinguish if data should be  grouped by day with 0, week with 1 or month with 2
exports.customersByService = (serviceName, dateType) =>{
    return new Promise((resolve, reject) => {
        let sql = '';
        switch (dateType) {
            case 0: sql = 'SELECT name, number FROM serviceStats WHERE service = ?'; break;
            case 1: sql = 'SELECT service, SUM(number), strftime(\'%Y-%m\', date)  FROM serviceStats WHERE service = ? GROUP BY service, strftime(\'%Y-%m\', date)'; break;
            default: sql = 'SELECT service, SUM(number), strftime(\'%Y-%m\', date)  FROM serviceStats WHERE service = ? GROUP BY service, strftime(\'%Y-%m\', date)'; break;
        }

        db.all(sql, [serviceName], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const pages = rows.map((e) => ({ id: e.id, name: e.name, averageTime: e.averageTime}));
            resolve(pages);
        });
    });
};

exports.incrementNumberCustomerService = (serviceName) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE serviceStats SET number = number+1 WHERE service=? AND date = current_date';
        db.run(sql, [serviceName], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            if(this.changes==0){
                const sql1 = 'INSERT INTO serviceStats(service, date, number) VALUES(?, current_date, 1)';
                db.run(sql1, [serviceName], (err)=>{
                    if(err){
                        reject(err);
                        return;
                    }
                    resolve(this.lastID);
                })
            }
            resolve(this.lastID);
        });
    });
}
//dateType is a number used to distinguish if data should be  grouped by day with 0, week with 1 or month with 2
exports.customersByCounter = (counterID, serviceName, dateType) =>{
    return new Promise((resolve, reject) => {
        let sql = '';
        switch (dateType) {
            case 0: sql = 'SELECT counter, name, number FROM counterStats WHERE counter = ? AND service = ?'; break;
            case 1: sql = 'SELECT counter, service, SUM(number), strftime(\'%Y-%m\', date)  FROM counterStats WHERE counter = ? AND service = ? GROUP BY counter, service, strftime(\'%Y-%m\', date)'; break;
            default: sql = 'SELECT counter, service, SUM(number), strftime(\'%Y-%m\', date)  FROM counterStats WHERE counter = ? AND service = ? GROUP BY counter, service, strftime(\'%Y-%m\', date)'; break;
        }

        db.all(sql, [serviceName], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const pages = rows.map((e) => ({ id: e.id, name: e.name, averageTime: e.averageTime}));
            resolve(pages);
        });
    });
};

exports.incrementNumberCustomerService = (counterID, serviceName) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE counterStats SET number = number+1 WHERE counter = ? AND service=? AND date = current_date';
        db.run(sql, [counterID, serviceName], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            if(this.changes==0){
                const sql1 = 'INSERT INTO counterStats(service, counter, date, number) VALUES(?, ?, current_date, 1)';
                db.run(sql1, [serviceName, counterID], (err)=>{
                    if(err){
                        reject(err);
                        return;
                    }
                    resolve(this.lastID);
                })
            }
            resolve(this.lastID);
        });
    });
}