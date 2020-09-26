const express = require('express');
const User = require('../models/user');
const { validateToken, verifyAdminRole } = require('../middlewares/auth');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const app = express();

app.get('/users', validateToken, (req, res) => {

  let from = Number(req.query.from) || 0;
  let limitFromPage = Number(req.query.limit) || 5;

  User.find({ userActive: true }, 'key firstName middleName lastName secondLastName email role userActive googleAccount image')
      .skip(from) //desde donde se obtiene la lista de usuarios
      .limit(limitFromPage) // el total que se quiere obtener
      .exec((onerror, users) => {
        if (onerror) {
          res.status(400).json({
            data: {},
            errorManager: {
              status: res.statusCode,
              errorNumber: 2,
              description: onerror
            }
          })
        }

        User.countDocuments({ userActive: true }, (onerror, countRegister) => {
          res.json({
            data: {
              users: [...users],
              total: countRegister
            },
            errorManager: {
              status: res.statusCode,
              errorNumber: 0,
              description: ''
            }
          });
        });
      });
});

app.post('/user', [validateToken, verifyAdminRole], (req, res) => {

  let body = req.body;

  let user = new User({
    firstName: body.firstName,
    middleName: body.middleName,
    lastName: body.lastName,
    secondLastName: body.secondLastName,
    email: body.email,
    key: body.key,
    password: bcrypt.hashSync(body.password, 10), // encriptacion
    role: body.role
  });

  user.save((onerror, userDB) => {
    if (onerror) {
      res.status(400).json({
        data: {},
        errorManager: {
          status: res.statusCode,
          errorNumber: 2,
          description: onerror.message
        }
      })
    }

    res.json({
      data: {
        user: userDB
      },
      errorManager: {
        status: res.statusCode,
        errorNumber: 0,
        description: ''
      }
    });
  });

});

app.put('/user/:key', [validateToken, verifyAdminRole], (req, res) => {
  let body = _.pick( // filtramos solo los parametros que se quiere actualizar
    req.body,
    ['firstName', 'middleName', 'lastName', 'secondLastName', 'image', 'role', 'userActive']
  );

  const query = { key: req.params.key };
  User.findOneAndUpdate(
    query,
    body,
    {
      new: true,
      runValidators: true
    },
    (onerror, userDB) =>{
    if (onerror) {
      res.status(400).json({
        data: {},
        errorManager: {
          status: res.statusCode,
          errorNumber: 2,
          description: `No se encontró ningún usuario con el id ${req.params.key}`
        }
      })
    }

    res.json({
      data: {
        user: userDB
      },
      errorManager: {
        status: res.statusCode,
        errorNumber: 0,
        description: ''
      }
    });
  });

});

app.delete('/user/:key', [validateToken, verifyAdminRole], (req, res) => {
  let changeUserActive = {
    userActive: false
  };
  const query = { key: req.params.key };
  User.findOneAndUpdate(
    query,
    changeUserActive,
    {
      new: true
    },
    (onerror, userDelete) => {
    if (onerror) {
      res.status(400).json({
        data: {},
        errorManager: {
          status: res.statusCode,
          errorNumber: 2,
          description: onerror
        }
      })
    }

    if (!userDelete) {
      return res.status(400).json({
        data: {},
        errorManager: {
          status: res.statusCode,
          errorNumber: 3,
          description: 'Usuario no encontrado'
        }
      })
    }

    res.json({
      data: {
        user: userDelete
      },
      errorManager: {
        status: res.statusCode,
        errorNumber: 0,
        description: ''
      }
    })
  });
});

module.exports = app;
