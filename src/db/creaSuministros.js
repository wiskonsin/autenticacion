const Suministro = require('../models/suministros.js'); // llamamos a suministros.js

var madera = {
    cantidad: 200,
    cantMax: 200,
    tipo: "Madera",
    lat: 43.462391,
    lon: -3.809801
}

var piedra = {
    cantidad: 100,
    cantMax: 100,
    tipo: "Piedra",
    lat: 43.462391,
    lon: -3.809801
}

var metal = {
    cantidad: 50,
    cantMax: 50,
    tipo: "Metal",
    lat: 43.462391,
    lon: -3.809801
}



async function crearMadera(){

    await suministro.insertOne(madera, function(err, res) {
        if (err) throw err;
        console.log("Madera insertada");
      });
    }
async function crearPiedra(){   
    await suministro.insertOne(piedra, function(err, res) {
        if (err) throw err;
        console.log("Piedra insertada");
    });
}
async function crearMetal(){   
      await suministro.insertOne(metal, function(err, res) {
        if (err) throw err;
        console.log("Metal insertada");
    });
}

crearMadera();
crearPiedra();
crearMetal();