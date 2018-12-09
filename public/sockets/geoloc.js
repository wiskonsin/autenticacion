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
  x.innerHTML = "Latitud: " + la1 + 
  "<br>Longitud: " + lon1 +
  "<br>Distancia al centro: " + d + " km";
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
  }