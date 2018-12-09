var x = document.getElementById("geo");

var boton = document.getElementById("geoloc");
boton.addEventListener("click",getLocation);

function getLocation() {
    console.log("geolocation");

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
    console.log("geosi");
  } else { 
    x.innerHTML = "Geolocation is not supported by this browser.";
    console.log("geono");

  }
}

function showPosition(position) {
  x.innerHTML = "Latitude: " + position.coords.latitude + 
  "<br>Longitude: " + position.coords.longitude;
}