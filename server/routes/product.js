const express = require('express');
const { validateToken, verifyAdminRole } = require('../middlewares/auth');
const app = express();
const Product = require('../models/products');
const _ = require('underscore');

app.get('/products', (req, resp) => {
  let from = Number(req.query.from) || 0;
  let limitFromPage = Number(req.query.limit) || 5;

  Product.find()
    .skip(from)
    .limit(limitFromPage)
    .populate(
      'user',
      'key firstName middleName lastName secondLastName email'
    )
    .populate(
      'categoryId',
      'key description'
    )
    .exec((onerror, productDB) => {
      if (onerror) {
        resp.status(400).json({
          data: {},
          errorManager: {
            status: resp.statusCode,
            errorNumber: 2,
            description: onerror
          }
        })
      }

      Product.countDocuments({}, (onerror, countRegister) => {
        resp.json({
          data: {
            products: [...productDB],
            total: countRegister
          },
          errorManager: {
            status: resp.statusCode,
            errorNumber: 0,
            description: ''
          }
        });
      });
    });
});

app.get('/product/search/:value', (req, resp) => {
  const value = req.params.value;

  const regex = new RegExp(value, 'i');

  Product.find({productName: regex})
    .populate('category', 'description')
    .exec((onerror, products) => {
      if (onerror) {
        return res.status(500).json({
          data: {},
          errorManager: {
            status: resp.statusCode,
            errorNumber: 2,
            description: onerror.message
          }
        });
      }

      resp.json({
        data: {
          products: products
        },
        errorManager: {
          status: resp.statusCode,
          errorNumber: 0,
          description: ''
        }
      });
    });
});

app.get('/product/:key', (req, resp) => {
  const query = { key: req.params.key };

  Product.findOne(query)
    .populate(
      'user',
      'key firstName middleName lastName secondLastName email'
    )
    .populate(
      'categoryId',
      'key description'
    )
    .exec((onerror, productDB) =>{
      if (onerror) {
        resp.status(400).json({
          data: {},
          errorManager: {
            status: resp.statusCode,
            errorNumber: 2,
            description: `No se encontró ningun producto con el id ${req.params.key}`
          }
        })
      }

      resp.json({
        data: {
          product: productDB
        },
        errorManager: {
          status: resp.statusCode,
          errorNumber: 0,
          description: ''
        }
      });
    });
});

app.post('/product', [validateToken, verifyAdminRole], (req, resp) => {
  let body = req.body;
  let product = new Product({
    key: body.key,
    productName: body.productName,
    priceUnitary: body.priceUnitary,
    description: body.description,
    stock: body.stock,
    available: body.available,
    categoryId: body.categoryId,
    image: body.image,
    user: req.user._id
  });

  product.save((onerror, productDB) => {
    if (onerror) {
      resp.status(400).json({
        data: {},
        errorManager: {
          status: resp.statusCode,
          errorNumber: 2,
          description: onerror.message
        }
      })
    }

    if (!productDB) {
      resp.status(400).json({
        data: {},
        errorManager: {
          status: resp.statusCode,
          errorNumber: 3,
          description: onerror.message
        }
      })
    }

    resp.json({
      data: {
        category: productDB
      },
      errorManager: {
        status: resp.statusCode,
        errorNumber: 0,
        description: ''
      }
    });
  });
});

app.put('/product/:key', [validateToken, verifyAdminRole], (req, resp) => {
  const query = { key: req.params.key };
  let body = _.pick(
    req.body,
    ['productName', 'priceUnitary', 'description', 'available', 'image', 'stock', 'categoryId']
  );

  Product.findOneAndUpdate(
    query,
    body,
    {
      new: true,
      runValidators: true
    },
    (onerror, productDB) =>{
      if (onerror) {
        resp.status(500).json({
          data: {},
          errorManager: {
            status: resp.statusCode,
            errorNumber: 2,
            description: `No se encontró ningun producto con el id ${req.params.key}`
          }
        })
      }

      if (!productDB) {
        resp.status(400).json({
          data: {},
          errorManager: {
            status: resp.statusCode,
            errorNumber: 3,
            description: onerror.message
          }
        })
      }

      resp.json({
        data: {
          product: productDB
        },
        errorManager: {
          status: resp.statusCode,
          errorNumber: 0,
          description: ''
        }
      });
    });
});

app.delete('/product/:key', [validateToken, verifyAdminRole], (req, resp) => {
  const query = { key: req.params.key };
  let changeProdAvailable = {
    available: false,
    stock: 0
  };

  Product.findOneAndUpdate(
    query,
    changeProdAvailable,
    {
      new: true
    },
    (onerror, productDelete) => {
      if (onerror) {
        resp.status(400).json({
          data: {},
          errorManager: {
            status: resp.statusCode,
            errorNumber: 2,
            description: onerror
          }
        })
      }

      if (!productDelete) {
        return resp.status(400).json({
          data: {},
          errorManager: {
            status: resp.statusCode,
            errorNumber: 3,
            description: 'Producto no encontrado'
          }
        })
      }

      resp.json({
        data: {
          product: productDelete
        },
        errorManager: {
          status: resp.statusCode,
          errorNumber: 0,
          description: ''
        }
      })
    });
});

module.exports = app;
