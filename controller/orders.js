const connection = require('../database');

const createOrder = (req, resp, next) => {

  const { userId, client, products } = req.body;
  if (!userId || !products || products.length === 0 || !client) return next(400);
  const newOrder = {
    userId,
    client,
    products: JSON.stringify(products),
    status: 'pending',
    dateEntry: new Date(),
    dateProcessed: null
  }
  console.log(newOrder)
  try {
    connection.query('INSERT INTO orders SET ?', [newOrder], (err, row) => {
      console.log(row)
      if(err)return next(err);
      resp.json({
        _id: row.insertId,
        ...newOrder,
        products: products,
      })
    });
  } catch (error) {
    if (error !== 200) return error;
  }
}

module.exports = {
  createOrder
}