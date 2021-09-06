const { isAdmin } = require('../middleware/auth');
const connection = require('../database');
const bcrypt = require('bcrypt');
const { queryGetDataUser } = require('../helpers/queryDb');
const pagination = require('../helpers/pagination');

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

const getUsers = async (req, resp, next) => {
  const { page = 1, limit = 10 } = req.query;
  const queryPage = (page - 1) * limit;
  const url = `${req.protocol}://${req.get('host')}${req.path}`;

  connection.query('SELECT * FROM users', (err, rows) => {
    const totalPages = Math.ceil(rows.length / limit);
    const links = pagination(url, limit, page, totalPages);
    try {
      connection.query(`SELECT _id, email, isAdmin FROM users LIMIT ${queryPage}, ${limit}`, (err, rows) => {
        if (err) console.error(err);
        const data = [...rows]
        const users = data.map(row => {
          return {
            _id: row._id,
            email: row.email,
            roles: {
              admin: !!row.isAdmin
            }
          }
        })
        resp.links(links).json(users)
      })
    } catch (error) {
      return next(error)
    }
  })
};

const createUser = async (req, resp, next) => {

  const { email, password, roles = { admin: false } } = req.body;
  if (!email || !password) return next(400)
  if (!email.includes('@')) return next(400)
  if (password.length < 5) return next(400)
  const newUser = {
    email,
    password: bcrypt.hashSync(password, 10),
    isAdmin: roles.admin
  }
  try {
    await connection.query('SELECT * FROM users  WHERE email = ?', [email], (err, rows) => {

      if (err) console.error(err);
      if (rows.length === 0) {
        connection.query('INSERT INTO users SET ?', [newUser], (err, row) => {
          if (err) console.error(err);
          resp.status(200).json({
            _id: (row.insertId).toString() || null,
            email: email,
            isAdmin: {
              admin: roles.admin
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

  if (isAdmin || email === uid || _id == uid) {
    const querySQL = isNaN(+uid) ? `email = "${uid}"` : `_id = ${uid}`;
    await queryGetDataUser(querySQL, resp, next);
  } else {
    return next(403);
  }
};

const updateUser = (req, resp, next) => {
  const { uid } = req.params;
  const { isAdmin, email } = req.userToken;
  const _id = req.userToken.uid;

  if (isAdmin || email === uid || _id == uid) {
    if (!req.body.email && !req.body.password) return next(400);
    const editUser = {}
    if (req.body.email) editUser.email = req.body.email;
    if (req.body.password) editUser.password = bcrypt.hashSync(req.body.password, 10);
    if (!isAdmin && req.body.isAdmin) return next(403)
    const querySQL = isNaN(+uid) ? `email = "${uid}"` : `_id = ${uid}`;
    connection.query('UPDATE users set ? WHERE ' + querySQL, [editUser], async (err, rows) => {
      if (err) console.error(err);
      if (rows.changedRows === 0) return next(404);

      await queryGetDataUser(querySQL, resp, next);
    })
  } else {
    return next(403);
  }
};

const deleteUser = (req, resp, next) => {
  const { uid } = req.params;
  const { isAdmin, email } = req.userToken;
  const _id = req.userToken.uid;

  if (isAdmin || email === uid || _id == uid) {
    const querySQL = isNaN(+uid) ? `email = "${uid}"` : `_id = ${uid}`;
    connection.query('SELECT * FROM users  WHERE ' + querySQL, (err, rows) => {
      if (err) console.error(err);
      if (rows.length === 0) return next(404);
      const user = { ...rows }
      const { _id, email, isAdmin } = user[0];
      const userData = ({
        _id,
        email,
        roles: {
          admin: !!isAdmin
        }
      })
      connection.query('DELETE FROM users WHERE _id = ?', [userData._id], (err, rows) => {
        if (err) console.error(err);
        resp.json(userData).status(200)
      })
    })
  } else {
    return next(403)
  }
};

module.exports = {
  postAdminUser,
  getUsers,
  createUser,
  getDataUser,
  updateUser,
  deleteUser
};
