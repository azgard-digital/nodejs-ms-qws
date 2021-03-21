const path = require('path')
const async = require('async')
require('dotenv').config()
const {connection} = require('./libs/mysql_connection')

class Migrate {
    #connection;
    #migrations = [];

    constructor(connection) {
        this.#connection = connection
    }

    initMigrateTable(callback) {
        const migrationTableSql = `
            CREATE TABLE IF NOT EXISTS migrations (
                id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        this.query(migrationTableSql, callback)
    }

    migrate(callback) {
        const fs = require('fs')
        const files = fs.readdirSync(path.join(__dirname, '/migrations'))
        let series = []

        for (let file of files) {
            const migration = fs.readFileSync(path.join(__dirname, '/migrations/', file), 'utf8');
            const migrationName = file.replace(/\.\w+/g, '')

            if (this.#migrations.indexOf(migrationName) < 0) {
                series.push((resolve) => {
                    console.info(`Migration ${migrationName} has been started...`)
                    this.query(migration, (err, result) => {

                        if (err) {
                            console.error(err)
                            resolve(err, null)
                        }

                        this.fixAddedMigration(migrationName, resolve)
                    });
                });
            }
        }

        async.series(series, function (err, results) {
            if (err) {
                console.error(err)
                callback(err, null)
            }

            console.info('DB is up to date!')
            callback(null, 1)
        });
    }

    fixAddedMigration(name, resolve) {
        this.#connection.query('INSERT INTO migrations SET ?', {name: name}, (error, results, fields) => {
            if (error) resolve(error,  null)
            console.info(`Migration ${name} finished!`)
            this.#migrations.push(name)
            resolve(null, 1)
        });
    }

    setListMigrations(callback) {
        this.query('select name from migrations', (err, results) => {

            if (err) callback(err, null);

            if (Array.isArray(results)) {
                for (let item of results) {
                    this.#migrations.push(item.name)
                }
            }

            callback(null, 1)
        });
    }

    query(sql, callback) {
        this.#connection.query(sql, (error, results, fields) => {
            if (error) callback(error, null)
            callback(null, results)
        });
    }
}

const facade = ((connection) => {
    return {
        migrate: () => {
            const migrate = new Migrate(connection);
            async.series([
                function (callback) {
                    migrate.initMigrateTable(callback)
                },
                function (callback) {
                    migrate.setListMigrations(callback)
                },
                function (callback) {
                    migrate.migrate(callback)
                }
            ],
            function (err, results) {
                if (err) console.error(err)
                connection.end()
            });
        }
    };
})(connection)

facade.migrate();