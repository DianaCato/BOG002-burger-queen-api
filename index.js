const express = require('express');
const config = require('./config');
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/error');
const routes = require('./routes');
const pkg = require('./package.json');
const morgan = require('morgan');

const { port, dbUrl, secret } = config;
const app = express();

// Conexión a la Base de Datos (MySQL)

const db = require('./database');
db.connect();

app.set('config', config);
app.set('pkg', pkg);

app.use(morgan('dev'));
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(authMiddleware(secret));

// Registrar rutas
routes(app, (err) => {
  if (err) {
    throw err;
  }

  app.use(errorHandler);

  app.listen(port, () => {
    console.info(`App listening on port ${port}`);
  });
});
