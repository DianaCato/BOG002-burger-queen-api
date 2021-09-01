module.exports = {
  getUsers: (req, resp, next) => {
  },
  createUser: async (dataUser, resp, next) =>{
    const bcrypt = require('bcrypt');
  const {email, password} = dataUser;
  const newUser = {...dataUser,
  password: bcrypt.hashSync(password, 10)
}
  if(!email|| !password ) return next(400)
  const connection = require('../database')
 try {
   await connection.query('SELECT * FROM users  WHERE email = ?', [email], (err, rows) => {
     console.log('creando usuario', rows)
     if (err) console.log(err);
     if (rows.length === 0) {
       connection.query('INSERT INTO users SET ?', [newUser],(err, rows) => {
         console.log('usuario creado', rows)
         if (err) console.log(err);
         resp.status(200).json({
           _id: rows.insertId,
           email: email,
           roles: {
             admin: false
           } 
           })
       });       
     }else {
       return next(403)
     }
   });
 } catch (error) {
   if (error !== 200) return error;
 }
}
};
