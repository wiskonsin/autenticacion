var latitud = document.getElementById("geolat");
var longitud = document.getElementById("geolon");
var distancia = document.getElementById("distancia");

var boton = document.getElementById("geoloc");
boton.addEventListener("click",getLocation);

var socket = io.connect('//autenticacionluis.herokuapp.com', {'forceNew': true}); // para conectarnos al servidor de sockets, con ello ya creamos la conexión
//var socket = io.connect('localhost:3200', {'forceNew': true});

socket.on('suministros', function(data){
    render(data); // llamamos a la función render que hemos creado más abajo
    contentString = '<div class="card border-light mb-3" style="max-width: 20rem;">'+
    '<div class="card-header">Suministro</div>'+
    '<div class="card-body">'+
    '<h4 class="card-title">'+data.tipo+'</h4>'+
    '<p class="card-text">Cantidad restante: '+data.cantidad+'</p>'+
    '</div>'+
    '</div>';
    initMap(data.lat,data.lon,contentString);

}); // evento que queremos escuchar (suministros)

function getLocation() {

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else { 
    latitud.innerHTML = "Geolocation is not supported by this browser.";
    longitud.innerHTML = "Geolocation is not supported by this browser.";
  }

}

//////MAPS

function initMap(lat1,lon1,contentString) {
  var myLatLng = {lat: lat1, lng: lon1};
  var infowindow = new google.maps.InfoWindow({
    content: contentString
  });
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: myLatLng,
    mapTypeControl: false
  });
  var image = 'http://maps.google.com/mapfiles/ms/icons/tree.png';
  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    icon:image,
    mapTypeId: google.maps.MapTypeId.HYBRID,
    labels:false
  });
  var styles = {
    default: null,
    retro: [
      {elementType: 'geometry', stylers: [{color: '#ebe3cd'}]},
      {elementType: 'labels.text.fill', stylers: [{color: '#523735'}]},
      {elementType: 'labels.text.stroke', stylers: [{color: '#f5f1e6'}]},
      {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [{color: '#c9b2a6'}]
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'geometry.stroke',
        stylers: [{color: '#dcd2be'}]
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'labels.text.fill',
        stylers: [{color: '#ae9e90'}]
      },
      {
        featureType: 'landscape.natural',
        elementType: 'geometry',
        stylers: [{color: '#dfd2ae'}]
      },
      {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{color: '#dfd2ae'}]
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{color: '#93817c'}]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry.fill',
        stylers: [{color: '#a5b076'}]
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{color: '#447530'}]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [
          { visibility: "off" }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [
          { visibility: "off" }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [
          { visibility: "off" }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [
          { visibility: "off" }
        ]
      },
      {
        featureType: 'road.highway.controlled_access',
        elementType: 'geometry',
        stylers: [
          { visibility: "off" }
        ]
      },
      {
        featureType: 'road.highway.controlled_access',
        elementType: 'geometry.stroke',
        stylers: [
          { visibility: "off" }
        ]
      },
      {
        featureType: 'road.local',
        elementType: 'labels.text.fill',
        stylers: [
          { visibility: "off" }
        ]
      },
      {
        featureType: 'transit.line',
        elementType: 'geometry',
        stylers: [{color: '#dfd2ae'}]
      },
      {
        featureType: 'transit.line',
        elementType: 'labels.text.fill',
        stylers: [{color: '#8f7d77'}]
      },
      {
        featureType: 'transit.line',
        elementType: 'labels.text.stroke',
        stylers: [{color: '#ebe3cd'}]
      },
      {
        featureType: 'transit.station',
        elementType: 'geometry',
        stylers: [{color: '#dfd2ae'}]
      },
      {
        featureType: 'water',
        elementType: 'geometry.fill',
        stylers: [{color: '#b9d3c2'}]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{color: '#92998d'}]
      }
    ],

  };
  map.setOptions({styles: styles["retro"]});
  infowindow.open(map, marker);
}

/////// MAPS

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
  //latitud.innerHTML = "<strong>Latitud: </strong>"+lat1;
  //longitud.innerHTML = "<strong>Longitud: </strong>"+lon1;
  latitud.innerHTML = lat1;
  longitud.innerHTML = lon1;
  distancia.innerHTML = "<strong>Distancia: </strong>"+d;
  
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
    if(data){
    var html =  `<div>
        <strong>${data.tipo}</strong>:
        <em>${data.cantidad}</em>
    </div>`;

  }
  else{
    var html =  `<div>
    <strong>Suministro agotado</strong>:
</div>`;
  }
    document.getElementById("suministro").innerHTML = html;
}
