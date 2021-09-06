const connection = require('../database');
const pagination = require('../helpers/pagination');
const verifyStatus = require('../helpers/verification');
const { 
  queryGetOrders, 
  querySetProductsInOrder, 
  queryGetOrdersWhitPagination, 
  queryGetOrdersWhitId, 
  deleteOrderAndGetResponse 
} = require('../helpers/queryDb');


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

const getOrderWhitId = (req, resp, next) => {
  const { orderId } = req.params;
  queryGetOrdersWhitId(orderId, resp, next);

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
};

const updateOrder = (req, resp, next) => {
 const { orderId } = req.params;
 const { userId, client, products, status } = req.body;
 
  if(userId || client || products || status) {
    
    const verification = verifyStatus(status);
    if(!verification[0]) return next(400);
   
    const updateOrder = {
      ...req.body,
      dateProcessed: verification[1] || null
    }
    delete updateOrder[products];
console.log('update')
    connection.query('UPDATE orders set ? WHERE _id = ?', [updateOrder, orderId], (err, rows) => {
      if (err) console.error(err);
       console.log('rows:',rows, 'change:', rows.changedRows)
      if (rows.changedRows === 0) return next(404);
      // connection.query('DELETE FROM products_in_order WHERE id_order = ?',[orderId]);

      // if (products) {
      //   querySetProductsInOrder(products, orderId);
      // }
      queryGetOrdersWhitId( 2, resp, next);
    })
 }else {
   return next(400)
 }
};

const deleteOrder = (req, resp, next) => {
  const { orderId } = req.params;
  deleteOrderAndGetResponse(orderId, resp, next);
};


module.exports = {
  getOrders,
  getOrderWhitId,
  createOrder,
  updateOrder,
  deleteOrder
}