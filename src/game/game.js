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

async function recolectaCliente(newSuministro){

    
    try {  const suministro = await Suministro.findOne({  "longitud": { $gt: newSuministro.longitud-0.002, $lt: newSuministro.longitud+0.002 },
                                        "latitud": { $gt: newSuministro.latitud-0.002, $lt: newSuministro.latitud+0.002 } }, function(err, result) {
        if (err){
            console.log(err);
        }
        else{
            var cantidad = suministro[0].cantidad;
            var id = suministro[0]._id;
            var suministro = {
                cantidad: cantidad,
                id: id
            }
            return suministro;
        }
    })        
     } catch (e) {
        console.log(e);
     }
}

async function actualizaSuministro(suministro){

    var id = suministro.id;
    var cantidad = suministro.cantidad;
    if(suministro.cantidad>0){
        try {
            await Suministro.updateOne({id:id}, {$set:{cantidad:cantidad-1}}, function(err, result) {
                if (err){
                    console.log(err);
                }});
        }
        catch(e){
            console.log(e);
        }
    }

}

    
