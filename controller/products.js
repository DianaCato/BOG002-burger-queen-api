const connection = require('../database');
const pagination = require('../helpers/pagination');

const getProducts = (req, resp, next) => {
  const { page = 1, limit = 10 } = req.query;
  const queryPage = (page - 1) * limit;
  const url = `${req.protocol}://${req.get('host')}${req.path}`;
  try {
    connection.query('SELECT * FROM products', (err, rows) => {
      const totalPages = Math.ceil(rows.length / limit);
      const links = pagination(url, limit, page, totalPages);

      connection.query(`SELECT * FROM products LIMIT ${queryPage}, ${limit}`, (err, rows) => {
        if (err) console.error(err);
        const dataProducts = [...rows]

        resp.links(links).json(dataProducts)
      })
    })
  } catch (error) {
    return next(error)
  }
};

const getProductWhitId = (req, resp, next) => {
  const { productId } = req.params;

  connection.query('SELECT * FROM products WHERE _id = ?', [productId], (err, rows) => {
    if (err) console.error(err);

    if (rows.length === 0) return next(404);

    resp.json(rows[0]);
  })
};

const createProduct = (req, resp, next) => {
  const { name, price } = req.body;
  if (!name || !price) return next(400);
  const newProduct = {
    ...req.body,
    dateEntry: new Date()
  }
  try {
    connection.query('INSERT INTO products SET ?', [newProduct], (err, row) => {
      if (err) console.error(err);
      resp.json({
        _id: (row.insertId).toString(),
        ...newProduct
      })
    });
  } catch (error) {
    if (error !== 200) return error;
  }
};

const updateProduct = (req, resp, next) => {
  const { productId } = req.params;
  const { isAdmin } = req.userToken;
  const { name, price, imagen, type } = req.body

  if (!isAdmin) return next(403);
  if (name || +price || imagen || type) {

    connection.query('UPDATE products set ? WHERE _id = ?', [req.body, productId], (err, rows) => {
      if (err) console.error(err);

      if (rows.changedRows === 0) return next(404);
      connection.query('SELECT * FROM products WHERE _id = ?', [productId], (err, rows) => {
        if (err) console.error(err);
        if (rows.length === 0) return next(404);

        resp.json(rows[0]);
      })
    })
  } else {
    return next(400)
  }
};

const deleteProducts = (req, resp, next) => {
  const { productId } = req.params;
  const { isAdmin } = req.userToken;

  if (!isAdmin) return next(403);

  connection.query('SELECT * FROM products  WHERE _id = ?', [productId], (err, rows) => {
    if (err) console.error(err);
    if (rows.length === 0) return next(404);

    const productsRows = { ...rows }
    const productData = productsRows[0];

    connection.query('DELETE FROM products WHERE _id = ?', [productId])

    resp.json(productData).status(200)
  })
};

module.exports = {
  getProducts,
  getProductWhitId,
  createProduct,
  updateProduct,
  deleteProducts
}