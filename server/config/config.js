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
process.env.SEED = 'dev'

/*
* Data base
*
* */

if (process.env.NODE_ENV === 'dev') {
  urlDB = 'mongodb://localhost:27017/shoes-store'
} else {
  // urlDB = process.env.MONGO_URI;
  urlDB = 'mongodb://shoes-store-user:cintiajaliri1994@ds139944.mlab.com:39944/shoes-store';
}

process.env.URLDB = urlDB;



