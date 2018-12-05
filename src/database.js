const mongoose = require('mongoose');
const { mongodb}   = require('./keys');

// utilizamos keys.js para las configuraciones

// nos conectamos a la base de datos a través de la URI que hay en key.js

mongoose.connect(mongodb.URI,{useNewUrlParser: true})
    .then(db => console.log('La base de datos está conectada'))
    .catch(err => console.log(err));