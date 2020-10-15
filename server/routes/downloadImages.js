const express = require('express');
const fs = require('fs');
const path =  require('path');
let app = express();

app.get('/image/:type/:image', (req, resp) => {
  let type = req.params.type;
  let image = req.params.image;

  let pathURLImage = path.resolve(__dirname, `../../uploads/${type}/${image}`);
  console.log(pathURLImage);
  if (fs.existsSync(pathURLImage)) {
    resp.status(200).json({
      data: {
        image: resp.sendFile(pathURLImage)
      },
      errorManager: {
        status: resp.statusCode,
        errorNumber: 0,
        description: ''
      }
    });

  } else {
    resp.status(400).json({
      data: {},
      errorManager: {
        status: resp.statusCode,
        errorNumber: 2,
        description: 'No existe el archivo'
      }
    });
  }
});

module.exports = app;
