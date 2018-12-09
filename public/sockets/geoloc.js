var x = document.getElementById("geo");

var boton = document.getElementById("geoloc");
boton.addEventListener("click",getLocation);

function getLocation() {

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else { 
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  var latitud = position.coords.latitude;
  var longitud = position.coords.longitude;
  var latitudCentro = 43.462391;
  var longitudCentro = -3.809801;
  var radioTierra = 6378;
  var deltaLat = (latitudCentro - latitud)*Math.PI/180;
  var deltaLon = (longitudCentro - longitud)*Math.PI/180;
  latitud = latitud*Math.PI/180;
  longitud = longitud*Math.PI/180;
  latitudCentro = latitudCentro*Math.PI/180;
  longitudCentro = longitudCentro*Math.PI/180;
  var distancia = (Math.sin(deltaLat/2))*(Math.sin(longitudCentro/2))+
  (Math.cos(latitud))*(Math.cos(latitudCentro))*
  (Math.sin(deltaLon/2))*(Math.sin(deltaLon/2));
  distancia = 2*Math.atan2(Math.sqrt(distancia),Math.sqrt(1-distancia));
  distancia = radioTierra*distancia;
  x.innerHTML = "Latitud: " + latitud + 
  "<br>Longitud: " + longitud +
  "<br>Distancia al centro: " + distancia;
}