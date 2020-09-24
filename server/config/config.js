const dotenv = require('dotenv').config();

/* ******
* puerto
* */
process.env.PORT = process.env.PORT || 3000;

/*
* Enviroment
* */

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/*
 * Expired date
 * */

process.env.EXP_TOKEN = 60 * 60 * 24 *30;

/*
 * SEED auth
 * */
process.env.SEED = process.env.SEED || process.env.SEEDDEV

/*
* Data base
*
* */
const userDB = process.env.DBUSER;
const password = process.env.DBPASS;
const dbName = process.env.DBNAME;
let urlDB = '';

if (process.env.NODE_ENV === 'dev') {
  urlDB = 'mongodb://localhost:27017/shoes-store'
} else {
  // urlDB = process.env.MONGO_URI;
  urlDB = `mongodb+srv://${userDB}:${password}@sandbox.tvuhf.mongodb.net/${dbName}?retryWrites=true&w=majority`;
}

process.env.URLDB = urlDB;



