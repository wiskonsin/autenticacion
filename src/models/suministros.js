const mongoose = require('mongoose');
const {Schema} = mongoose; // Usamos el Schema de la biblioteca mongoose

// inicializamos el schema

const suministroSchema = new Schema ({
    lat: Number,
    lon: Number,
    tipo: String,
    cantMax: Number, // cantidad máxima
    cantidad: Number // cantidad actual
})

// Definimos el método de recolección de suministros
// NO LO ESTAMOS USANDO //

suministroSchema.methods.recolecta = (cantidad) => {

    if(cantidad>0){
    return true;
    }
    else{
        return false;
    }
}

// Llamamos al método model para que cargue el Schema de usuarios en la colección 'users'
// y lo exportamos
module.exports = mongoose.model('suministros',suministroSchema);