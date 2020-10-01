const express = require('express');
const { validateToken, verifyAdminRole } = require('../middlewares/auth');
const app = express();
const Product = require('../models/products');

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

app.post('/product', [validateToken, verifyAdminRole], (req, resp) => {
  let body = req.body;
  let product = new Product({
    key: body.key,
    productName: body.productName,
    priceUnitary: body.priceUnitary,
    description: body.description,
    stock: body.stock,
    categoryId: body.categoryId,
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

module.exports = app;
