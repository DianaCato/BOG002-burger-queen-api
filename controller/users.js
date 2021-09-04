const { isAdmin } = require('../middleware/auth');
const connection = require('../database');
const bcrypt = require('bcrypt');

const postAdminUser = (adminUser, next) => {
  const newUser = {
    ...adminUser,
    isAdmin: adminUser.isAdmin.admin
  };

  try {
    connection.query('SELECT * FROM users  WHERE email = ?', [newUser.email], (err, rows) => {
      if (err) console.error(err);

      if (rows.length === 0) {
        connection.query('INSERT INTO users SET ?', [newUser]);
      }
      return next;
    });
  } catch (error) {
    if (error !== 200) return error;
  }
};

const getUsers = (req, resp, next) => {
  const { page = 1, limit = 10 } = req.query;
  const queryPage = (page - 1) * limit;
  const url = `${req.protocol}://${req.get('host')}${req.path}`;
  const totalPages = connection.query('SELECT * FROM users', (err, rows) => {
    return Math.ceil(rows.length / limit);
  })

  try {
    connection.query(`SELECT id, email, isAdmin FROM users LIMIT ${queryPage}, ${limit}`, (err, rows) => {
      if (err) console.error(err);
      const data = [...rows]

      const users = data.map(row => {
        return {
          _id: row.id,
          email: row.email,
          roles: {
            admin: !!row.isAdmin
          }
        }
      })

      resp.links({
        first: `${url}?limit=${limit}&page=1`,
        prev: page > 1 ? `${url}?limit=${limit}&page=${page - 1}` : `${url}?limit=${limit}&page=${page}`,
        next: page < totalPages ? `${url}?limit=${limit}&page=${page + 1}` : `${url}?limit=${limit}&page=${page}`,
        last: `${url}?limit=${limit}&page=${totalPages}`
      }).json(users)

    })
  } catch (error) {
    return next(error)
  }
};

const createUser = async (dataUser, resp, next) => {
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
};

const getDataUser = async (req, resp, next) => {
  const { uid } = req.params;
  const { isAdmin, email, } = req.userToken;
  const _id = req.userToken.uid;

  if (!uid) return next(401);
  if (isAdmin || email === uid || _id == uid) {
    const querySQL = isNaN(+uid) ? `email = "${uid}"` : `id = ${uid}`;
    await connection.query('SELECT * FROM users  WHERE ' + querySQL, (err, rows) => {
      if (err) console.error(err);
      if (rows.length === 0) return next(404);
      const user = { ...rows }
      const { id, email, isAdmin } = user[0];
      resp.json({
        _id: id,
        email,
        roles: {
          admin: !!isAdmin
        }
      })
    })
  } else {
    return next(403);
  }
}

module.exports = {
  postAdminUser,
  getUsers,
  createUser,
  getDataUser
};
