const connection = require('../database');

const queryGetData = (querySQL, resp, next) => {
    connection.query('SELECT * FROM users  WHERE ' + querySQL, (err, rows) => {
        if (err) console.error(err);
        if (rows.length === 0) return next(404);
        const user = { ...rows }
        const { _id, email, isAdmin } = user[0];
        resp.json({
            _id,
            email,
            roles: {
                admin: !!isAdmin
            }
        })
    })
}

module.exports = {
    queryGetData
}