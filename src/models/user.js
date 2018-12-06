const mongoose = require('mongoose');
const { Schema} = mongoose; // Usamos el Schema de la biblioteca mongoose
const bcrypt = require('bcrypt-nodejs');

// inicializamos el schema

const userSchema = new Schema ({
    email: String,
    password: String,
    name: String,
    description: String,
    progress: Number
})

// Definimos los métodos de encriptado/desencriptado

userSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10)); // aplicamos el algoritmo de cifrado 10 veces
}

userSchema.methods.comparePassword = function (password){
    return bcrypt.compareSync(password, this.password); // comparamos la contraseña con la almacenada
}

// Llamamos al método model para que cargue el Schema de usuarios en la colección 'users'
// y lo exportamos
module.exports = mongoose.model('users',userSchema);