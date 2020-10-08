const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const User = require('../models/user');

app.use( fileUpload({ useTempFiles: true }) );

app.put('/upload/:type/:id', (req, resp) => {
  const type = req.params.type;
  const id = req.params.id;

  if (!req.files) {
    return resp.status(400).json({
      data: {},
      errorManager: {
        status: resp.statusCode,
        errorNumber: 2,
        description: 'No se seleccionado ningún archivo'
      }
    });
  }

  let allowedTypes = ['products', 'users'];

  if (allowedTypes.indexOf(type) < 0) {
    return resp.status(400).json({
      data: {},
      errorManager: {
        status: resp.statusCode,
        errorNumber: 3,
        description: 'Las tipos permitidos son' + allowedTypes.join(', ')
      }
    });
  }

  let fileUpload = req.files.file;
  let splitNameFile = fileUpload.name.split('.');
  let extension = splitNameFile[splitNameFile.length - 1];

  let allowedExtensions = ['png', 'jpg', 'jpeg', 'gif'];

  if (allowedExtensions.indexOf(extension) < 0) {
    return resp.status(400).json({
      data: {},
      errorManager: {
        status: resp.statusCode,
        errorNumber: 3,
        description: 'Las extensiones permitidas son' + allowedExtensions.join(', ')
      }
    });
  }

  const nameFile = `${id}-${new Date().getMilliseconds()}.${extension}`

  fileUpload.mv(`uploads/${type}/${nameFile}`, (err) => {
    if (err) {
      return resp.status(500).json({
        data: {},
        errorManager: {
          status: resp.statusCode,
          errorNumber: 2,
          description: err
        }
      });
    }

    resp.status(200).json({
      data: {},
      errorManager: {
        status: resp.statusCode,
        errorNumber: 0,
        description: 'Archivo subido con éxito'
      }
    });
  });
});


module.exports = app;
