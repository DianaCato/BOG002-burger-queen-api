const connection = require('../database');

const createProduct = (req, resp, next) => {
    const { name, price } = req.body;
    if (!name || !price ) return next(400);
    const newProduct = {
       ...req.body,
       dateEntry: new Date()
    }
    console.log(newProduct)
    try {
      connection.query('INSERT INTO products SET ?', [newProduct], (err, row) => {
        if(err)console.error(err);
        console.log(row)
        resp.json({
          _id: (row.insertId).toString(),
          ...newProduct
        })
      });
    } catch (error) {
      if (error !== 200) return error;
    }
  
}

module.exports = {
 createProduct
}