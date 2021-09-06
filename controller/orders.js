const connection = require('../database');
const pagination = require('../helpers/pagination');
const { queryGetOrders, querySetProductsInOrder, queryGetOrdersWhitPagination } = require('../helpers/queryDb');

const getOrders = (req, resp, next) => {
  const { page = 1, limit = 10 } = req.query;
  const queryPage = (page - 1) * limit;
  const url = `${req.protocol}://${req.get('host')}${req.path}`;
  try {
    connection.query('SELECT * FROM orders', (err, rows) => {
      const totalPages = Math.ceil(rows.length / limit);
      const links = pagination(url, limit, page, totalPages);

      queryGetOrdersWhitPagination(queryPage, limit, links, resp)

    })
  } catch (error) {
    return next(error)
  }
};

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
  getOrders,
  createOrder
}