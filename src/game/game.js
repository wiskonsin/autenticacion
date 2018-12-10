const Suministro = require('../models/suministros.js'); // llamamos a suministros.js

   async function recolectar(newSuministro) {
       newSuministro.cantidad = newSuministro.cantidad-1;
       console.log(newSuministro);
       try { await Suministro.updateOne({_id:newSuministro._id}, {$set:{cantidad:newSuministro.cantidad}}, function(err, result) {
        if (err){
            console.log(err);
        }
    })        
       console.log("Suministro actualizado");
     } catch (e) {
        console.log(e);
     }
   }

async function suministrar(){
    const suministro = await Suministro.find({});
    console.log("ID: "+suministro[0]._id+" cantidad= "+suministro[0].cantidad);
    newSuministro = new Suministro;
    newSuministro.cantidad = suministro[0].cantidad;
    newSuministro._id = suministro[0]._id;
    if(newSuministro.recolecta(newSuministro.cantidad)){
        recolectar(newSuministro);
    }
    else{
        console.log("Suministro agotado.");
    }
};
//suministrar();


module.exports = {
    recolectaCliente: async function recolectaCliente(newSuministro){

 const suministro = await Suministro.findOne({  lon: { $gt: newSuministro[0].longitud-10, $lt: newSuministro[0].longitud+10 },
                                        lat: { $gt: newSuministro[0].latitud-10, $lt: newSuministro[0].latitud+10 } }, function(err, result) {
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
                    console.log("No se ha actualizado.");
                }

}
}
    
