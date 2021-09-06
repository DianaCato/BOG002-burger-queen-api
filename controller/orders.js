const connection = require('../database');
const { queryGetOrders, querySetProductsInOrder } = require('../helpers/queryDb');

const createOrder = (req, resp, next) => {
  const { userId, client, products } = req.body;

  if (!userId || products.length === 0) return next(400);

  const newOrder = {
    userId,
    client,
    status: 'pending',
    dateEntry: new Date(),
    dateProcessed: null
  }

  try {
    connection.query('INSERT INTO orders SET ?', [newOrder], (err, row) => {
      if (err) return next(err);
      const _id = row.insertId;
      querySetProductsInOrder(products, _id);
      queryGetOrders(_id, newOrder, resp);
    })
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createOrder
}