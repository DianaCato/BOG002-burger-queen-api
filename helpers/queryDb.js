const connection = require('../database');

const getArrayProducts = (rows) => {
  const arrayProducts = rows.map(row => {
    const dataProduct = {
      name: row.name,
      price: row.price,
      imagen: row.imagen,
      type: row.type
    }
    return {
      qty: row.qty,
      product: dataProduct
    }
  })
  return arrayProducts;
};

const queryGetDataUser = (querySQL, resp, next) => {
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
};

const queryGetOrders = (_id, newOrder, resp) => {
  connection.query(`SELECT userId, client, status, orders.dateEntry, dateProcessed, qty, name, price, imagen, type FROM orders 
    INNER JOIN products_in_order ON orders._id = products_in_order.id_order 
    INNER JOIN products ON products_in_order.id_product = products._id WHERE orders._id = ?`,
    [_id], (err, rows) => {

      const arrayProducts = getArrayProducts(rows);

      resp.json({
        _id,
        ...newOrder,
        products: arrayProducts
      })
    })
};

const queryGetOrdersWhitPagination = (queryPage, limit, links, resp) => {
  connection.query(`SELECT userId, client, status, orders.dateEntry, dateProcessed, qty, name, price, imagen, type FROM orders 
      INNER JOIN products_in_order ON orders._id = products_in_order.id_order 
      INNER JOIN products ON products_in_order.id_product = products._id LIMIT ${queryPage}, ${limit}`,
    (err, rows) => {

      const arrayOrders = rows.map(row => {
      // const arrayProducts = getArrayProducts(row)
        // return {
        //   ...row,
        //   products: arrayProducts
        // }}
        console.log(row)
      })
      resp.links(links).json(rows)
    })
};

const querySetProductsInOrder = (products, id) => {
  products.forEach(product => {
    const productItem = {
      id_order: id,
      id_product: product.productId,
      qty: product.qty
    }
    connection.query('INSERT INTO products_in_order SET ?', [productItem]);
  })
};

module.exports = {
  queryGetDataUser,
  queryGetOrders,
  querySetProductsInOrder,
  queryGetOrdersWhitPagination
}