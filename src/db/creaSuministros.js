const Suministro = require('../models/suministros.js'); // llamamos a suministros.js
require('../database');

var madera = {
    cantidad: 200,
    cantMax: 200,
    tipo: "Madera",
    lat: 42.76,
    lon: -4.84
}

var piedra = {
    cantidad: 100,
    cantMax: 100,
    tipo: "Piedra",
    lat: 42.76,
    lon: -4.84
}

var metal = {
    cantidad: 50,
    cantMax: 50,
    tipo: "Metal",
    lat: 42.76,
    lon: -4.84
}

var limLatSup = 43.54;
var limLonSup = -3.15;
var limLatInf = 42.76;
var limLonInf = -4.84;

async function crearMadera(madera){

    await Suministro.create(madera, function(err, res) {
        if (err) throw err;
        console.log("Madera insertada");
      });
    }
async function crearPiedra(piedra){   
    await Suministro.create(piedra, function(err, res) {
        if (err) throw err;
        console.log("Piedra insertada");
    });
}
async function crearMetal(metal){   
      await Suministro.create(metal, function(err, res) {
        if (err) throw err;
        console.log("Metal insertado");
    });
}

var lat = limLatInf;
var lon = limLonInf;
var delta = 0.002;

async function init(){
    console.log(1)
    await sleep(1000)
    console.log(2)
    console.log("Al lío");
    
    while(lat <= limLatSup){

        madera.lat = lat;
        piedra.lat = lat;
        metal.lat = lat;
        while(lon <= limLonSup){
            madera.lon = lon;
            crearMadera(madera);
            lon = lon + delta;
            piedra.lon = lon;
            crearPiedra(piedra);
            lon = lon + delta;
            metal.lon = lon;
            crearMetal(metal);
            lon = lon + delta;
            await sleep(50)
        }
        lon = limLonInf;
        lat = lat + delta;
        await sleep(50)
    }

 }
 function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}
 init();
