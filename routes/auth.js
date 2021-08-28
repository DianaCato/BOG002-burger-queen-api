const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');
const connection = require('../database');

const { secret } = config;

/** @module auth */
module.exports = (app, nextMain) => {
  /**
   * @name /auth
   * @description Crea token de autenticación.
   * @path {POST} /auth
   * @body {String} email Correo
   * @body {String} password Contraseña
   * @response {Object} resp
   * @response {String} resp.token Token a usar para los requests sucesivos
   * @code {200} si la autenticación es correcta
   * @code {400} si no se proveen `email` o `password` o ninguno de los dos
   * @auth No requiere autenticación
   */
  app.post('/auth', async (req, resp, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(400);
    }

    // TODO: autenticar a la usuarix

   const rows = await connection.query('SELECT * FROM users  WHERE email = ?', [email]);
    if(rows.length > 0){
      const user = rows[0];
      const passwordEncrypt = bcrypt.hashSync(password, 10);
      matchPassword = async (password, savePassword) => {
        try {
       return await bcrypt.compare(password, savePassword);
      } catch(e){
        console.log(e);
      }
    }
    const validPassword = await matchPassword(password, user.password);

    validPassword ? next(404) : resp.json({
      auth: true,
      user
      });
    }
    next();
  });

  return nextMain();
};
