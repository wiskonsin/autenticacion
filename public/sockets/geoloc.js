var latitud = document.getElementById("geolat");
var longitud = document.getElementById("geolon");
var distancia = document.getElementById("distancia");

var boton = document.getElementById("geoloc");
boton.addEventListener("click",getLocation);

var socket = io.connect('//autenticacionluis.herokuapp.com', {'forceNew': true}); // para conectarnos al servidor de sockets, con ello ya creamos la conexión

socket.on('suministros', function(data){
    console.log(data);
    render(data); // llamamos a la función render que hemos creado más abajo

}); // evento que queremos escuchar (suministros)

function getLocation() {

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else { 
    latitud.innerHTML = "Geolocation is not supported by this browser.";
    longitud.innerHTML = "Geolocation is not supported by this browser.";
  }

}

function showPosition(position) {
  var lat1 = position.coords.latitude;
  var lon1 = position.coords.longitude;
  var lat2 = 43.462391;
  var lon2 = -3.809801;
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  latitud.innerHTML = lat1;
  longitud.innerHTML = lon1;
  distancia.innerHTML = d;

  var payload = {
    latitud: lat1,
    longitud: lon1
};

  socket.emit('newRecolecta',payload); // emitimos el evento newmessage con el contenido payload

}

function deg2rad(deg) {
    return deg * (Math.PI/180)
  }


  function render(data){
    // Con la notación `` nos permite escribir lo que queramos en el string, dentro de las comillas
    // Con ${} puedo meter todo lo que esté en la variable
    var html = data.map(function(elem, index){
        return( `<div>
        <strong>${elem.tipo}</strong>:
        <em>${elem.cantidad}</em>
    </div>`);
    }).join(" "); // con join lo separamos con espacios en este caso
    
    
   
    document.getElementById("suministro").innerHTML = html;
}