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
    // TODO: autenticar a la usuarix 'SELECT * FROM users  WHERE email = ?', [email], (err, rows)
    await connection.query('SELECT * FROM users WHERE email =?', [email], (err, rows) => {
      if (err) console.error(err);
      if (rows.length > 0) {
        const user = rows[0];

        matchPassword = (password, savePassword) => {
          try {
            return bcrypt.compare(password, savePassword);
          } catch (e) {
            console.error(e);
          }
        }
        const validPassword = matchPassword(password, user.password);

        validPassword.then(res => {

          if (res) {
            jwt.sign(
              {
                uid: user.id,
                email: user.email,
                isAdmin: user.isAdmin,
              },
              secret,
              {
                expiresIn: '6h',
              },
              (err, token) => {
                if (err) console.error(err);

                return resp.json({ token });
              },
            );
          } else {
            next(404)
          }
        }).catch(err => console.error(err))
      } else {
        next(404)
      }
    });
  });

  return nextMain();
};
