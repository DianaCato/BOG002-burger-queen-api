const mysql = require('mysql');
const config = require('./config');
const { dbPort, dbName, dbUser, dbPassword } = config;

const connection = mysql.createConnection({
    host: 'localhost',
    port: dbPort,
    database: dbName,
    user: dbUser,
    password: dbPassword
});

module.exports = connection;