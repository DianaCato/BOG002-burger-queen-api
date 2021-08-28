const mysql = require('mysql');
const config = require('./config');
const { promisify } = require('util');
const { port, dbUrl, secret } = config;

// Conexión a la Base de Datos (MySQL)

// const pool = mysql.createPool(database);

// pool.getConnection((err, connection) => {
//     if(err){
//         return console.error(err)
//     }
//     if (connection) connection.release();
//     console.log('conected!');
//     return;
// });

// pool.query = promisify(pool.query);

// module.exports = pool;

const connection = mysql.createConnection({
    host:'localhost',
    port:33060,
    database:'test',
    user:'test',
    password:'secret'
});
// connection.query('SELECT 1 + 15 AS solution', (error, results) => {
//   if (error) {
//     return console.error(error);
//   }
//   console.log(`The solution is: ${results[0].solution}`);
// });
// connection.end();

module.exports = connection;