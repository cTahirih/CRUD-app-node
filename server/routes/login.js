const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const app = express();

app.post('/login', (req, resp) => {
  let body = req.body;

  User.findOne({
    email: body.email
  }, (onerror, userDB) => {
    if (onerror) {
      return resp.status(500).json({ // error de base de datos
        data: {
          accessToken: null
        },
        errorManager: {
          status: resp.statusCode,
          errorNumber: 2,
          description: onerror
        }
      });
    }

    if (!userDB) {
      return resp.status(400).json({
        data: {
          accessToken: null
        },
        errorManager: {
          status: resp.statusCode,
          errorNumber: 2,
          description: 'Usuario o contraseña incorrecto'
        }
      });
    }

    if (!userDB.userActive) {
      return resp.status(400).json({
        data: {
          accessToken: null
        },
        errorManager: {
          status: resp.statusCode,
          errorNumber: 4,
          description: 'El usuario no está activo'
        }
      });
    }

    if (!bcrypt.compareSync(
      body.password, userDB.password
      )) {
      return resp.status(400).json({
        data: {
          accessToken: null
        },
        errorManager: {
          status: resp.statusCode,
          errorNumber: 3,
          description: 'Usuario o contraseña incorrecto'
        }
      });
    }

    let token = jwt.sign({
      user: userDB
    }, process.env.SEED, {
      expiresIn: process.env.EXP_TOKEN
    });

  resp.json(({
      data: {
        accessToken: token
      },
      errorManager: {
        status: resp.statusCode,
        errorNumber: 0,
        description: ''
      }
    }));

  });

});

module.exports = app;
