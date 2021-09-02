const jwt = require('jsonwebtoken');
const connection = require('../database');

module.exports = (secret) => (req, resp, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next();
  }

  const [type, token] = authorization.split(' ');

  if (type.toLowerCase() !== 'bearer') {
    return next();
  }

  jwt.verify(token, secret, async (err, decodedToken) => {
    if (err) {
      return next(403);
    }
       // TODO: Verificar identidad del usuario usando `decodeToken.uid`
     await connection.query('SELECT * FROM users WHERE id = ?', [decodedToken.uid], (err, rows) => {
        if (err) console.error(err);
       if(!rows) return next(404);
        req.userToken = decodedToken;
        return next()
    })
  });
};

 // TODO: decidir por la informacion del request si la usuaria esta autenticada
module.exports.isAuthenticated = (req) =>(!!req.userToken);

 // TODO: decidir por la informacion del request si la usuaria es admin
module.exports.isAdmin = (req) => (!!req.userToken.isAdmin);


module.exports.requireAuth = (req, resp, next) => (
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : next()
);


module.exports.requireAdmin = (req, resp, next) => (
  // eslint-disable-next-line no-nested-ternary
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : (!module.exports.isAdmin(req))
      ? next(403)
      : next()
);
