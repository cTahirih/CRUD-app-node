/* ******
* puerto
* */
process.env.PORT = process.env.PORT || 3000;

/*
* Enviroment
* */

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/*
* Data base
*
* */

if (process.env.NODE_ENV === 'dev') {
  urlDB = 'mongodb://localhost:27017/shoes-store'
} else {
  urlDB = 'mongodb://shoes-store-user:cintiajaliri1994@ds139944.mlab.com:39944/shoes-store'
}
urlDB = process.env.MONGO_URI;

process.env.URLDB = urlDB;



