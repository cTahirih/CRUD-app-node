const express = require('express');
const { verificaToken } = require('../middlewares/auth');
const _ = require('underscore');
const app = express();
const Category = require('../models/category');

// muestra toda las categorias
app.get('/categories', (req, resp) => {
  Category.find({})
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
  Category.findOne(
    query,
    (onerror, categoryDB) =>{
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
    });
});

// crear nueva categoria
app.post('/category', (req, resp) => {
  let body = req.body;

  let category = new Category({
    key: body.key,
    description: body.description,
    user: body.user
  });

  category.save((onerror, categoryDB) => {
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
app.put('/category/:key', (req, resp) => {
  let body = _.pick( // filtramos solo los parametros que se quiere actualizar
    req.body,
    ['description']
  );

  const query = { key: req.params.key };
  Category.findOneAndUpdate(
    query,
    body,
    {
      new: true
    },
    (onerror, categoryDB) =>{
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
    });
});

// elimina una categoria
app.delete('/category/:key', (req, resp) => {
  const query = { key: req.params.key };

  Category.findOneAndDelete(
    query,
    {new: true},
    (onerror, categoryDeleted) => {
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
        data: {
          category: categoryDeleted
        },
        errorManager: {
          status: resp.statusCode,
          errorNumber: 0,
          description: ''
        }
      })
    }
  );
});

module.exports = app;
