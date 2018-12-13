const Suministro = require('../models/suministros.js'); // llamamos a suministros.js

module.exports = {
    recolectaCliente: async function recolectaCliente(newSuministro){

 const suministro = await Suministro.findOne({  lon: { $gt: newSuministro[0].longitud-0.002, $lt: newSuministro[0].longitud+0.002 },
                                        lat: { $gt: newSuministro[0].latitud-0.002, $lt: newSuministro[0].latitud+0.002 } }, function(err, result) {
        if (err){
            console.log(err);
        }
            

    }) 
    
     var suministros = {
                cantidad: suministro.cantidad,
                id: suministro._id,
                lon: suministro.lon,
                lat: suministro.lat,
                tipo: suministro.tipo}
                console.log("Suministro: "+suministros.id+" cantidad restante: "+suministros.cantidad);

                if(suministro.cantidad>0){
                    console.log("Aún no está agotado");
                    try {
                        await Suministro.updateOne({_id:suministro._id}, {$set:{cantidad:suministro.cantidad-1}}, function(err, result) {
                            if (err){
                                console.log(err);
                            }});
                        return suministros}
                    catch(e){
                        console.log(e);
                    }
                }
                else{
                    console.log("Suministro agotado.");
                }

}
}