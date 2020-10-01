const express = require('express');
const { validateToken, verifyAdminRole } = require('../middlewares/auth');
const app = express();
const Category = require('../models/category');

// muestra toda las categorias
app.get('/categories', (req, resp) => {
  Category.find({})
    .sort('description')
    .populate(
      'user',
      'firstName middleName lastName secondLastName email key')
    .exec((onerror, category) => {
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

      Category.countDocuments({}, (onerror, countRegister) => {
        resp.json({
          data: {
            categories: [...category],
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

// muestra categoria por KEY
app.get('/category/:key', (req, resp) => {
  const query = { key: req.params.key };
  Category.findOne(query)
    .populate('user',
      'firstName middleName lastName secondLastName email key')
    .exec((onerror, categoryDB) =>{
      if (onerror) {
        resp.status(400).json({
          data: {},
          errorManager: {
            status: resp.statusCode,
            errorNumber: 2,
            description: `No se encontró ninguna categoría con el id ${req.params.key}`
          }
        })
      }

      resp.json({
        data: {
          category: categoryDB
        },
        errorManager: {
          status: resp.statusCode,
          errorNumber: 0,
          description: ''
        }
      });
    })

});

// crear nueva categoria
app.post('/category', [validateToken, verifyAdminRole], (req, resp) => {
  let body = req.body;

  let category = new Category({
    key: body.key,
    description: body.description,
    user: req.user._id
  });

  category.save((onerror, categoryDB) => {
    if (onerror) {
      resp.status(500).json({
        data: {},
        errorManager: {
          status: resp.statusCode,
          errorNumber: 2,
          description: onerror.message
        }
      })
    }

    if (!categoryDB) {
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
        category: categoryDB
      },
      errorManager: {
        status: resp.statusCode,
        errorNumber: 0,
        description: ''
      }
    });
  });
});

// actualiza una categoria
app.put('/category/:key',  [validateToken, verifyAdminRole], (req, resp) => {
  let body = {
    description: req.body.description
  };

  const query = { key: req.params.key };
  Category.findOneAndUpdate(
    query,
    body,
    {
      new: true,
      runValidators: true
    },
    (onerror, categoryDB) =>{
      if (onerror) {
        resp.status(500).json({
          data: {},
          errorManager: {
            status: resp.statusCode,
            errorNumber: 2,
            description: `No se encontró ninguna categoría con el id ${req.params.key}`
          }
        })
      }

      if (!categoryDB) {
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
          category: categoryDB
        },
        errorManager: {
          status: resp.statusCode,
          errorNumber: 0,
          description: ''
        }
      });
    });
});

// elimina una categoria
app.delete('/category/:key',  [validateToken, verifyAdminRole], (req, resp) => {
  const query = { key: req.params.key };

  Category.findOneAndRemove(
    query,
    {new: true},
    (onerror, categoryDeleted) => {
      if (onerror) {
        resp.status(500).json({
          data: {},
          errorManager: {
            status: resp.statusCode,
            errorNumber: 2,
            description: onerror
          }
        })
      }

      if (!categoryDeleted) {
        return resp.status(400).json({
          data: {},
          errorManager: {
            status: resp.statusCode,
            errorNumber: 3,
            description: 'Categoria no encontrado'
          }
        })
      }

      resp.json({
        data: { },
        errorManager: {
          status: resp.statusCode,
          errorNumber: 0,
          description: 'Categoria eliminada'
        }
      })
    }
  );
});

module.exports = app;
