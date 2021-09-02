const { isAdmin } = require('../middleware/auth');

module.exports = {
  getUsers: (req, resp, next) => {
  },
  createUser: async (dataUser, resp, next) => {
    const bcrypt = require('bcrypt');
    const connection = require('../database');
    const { email, password } = dataUser;

    if (!email || !password) return next(400)
    const newUser = {
      ...dataUser,
      password: bcrypt.hashSync(password, 10),
      isAdmin: isAdmin.admin || false
    }

    try {
      await connection.query('SELECT * FROM users  WHERE email = ?', [email], (err, rows) => {

        if (err) console.log(err);
        if (rows.length === 0) {
          connection.query('INSERT INTO users SET ?', [newUser], (err, rows) => {

            if (err) console.error(err);
            resp.status(200).json({
              _id: rows.insertId || null,
              email: email,
              isAdmin: {
                admin: false
              }
            })
          });
        } else {
          return next(403)
        }
      });
    } catch (error) {
      if (error !== 200) return error;
    }
  }
};
