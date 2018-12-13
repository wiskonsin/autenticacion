const express = require('express');
const engine = require('ejs-mate');
const path = require('path'); // con esta librería manejamos los paths más fácilmente
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const GoogleMapsAPI = require('googlemaps');

// Inicializaciones
const app = express();
require('./database');
require('./passport/local-auth');
var game = require('./game/game');

/*require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  serverip = add;
  console.log(serverip);
});*/

var helmet = require('helmet');

// settings
app.set('views', path.join(__dirname,'views')); // defino dónde está la carpeta de vistas
// con .join(__dirname) obtengo el directorio actual en donde está este fichero index.js
//finalmente lo concateno con la carpeta 'views'
app.engine('ejs',engine); // usa el motor de plantillas que acabamos de definir
app.set('view engine', 'ejs');
app.use(helmet());
//////////////////// SOCKETS ////////////////////

// parte sockets
var server = require('http').Server(app);
var io = require('socket.io')(server); // npm install socket.io --save

var messages = [{
  id:1,
  text: "Bienvenido al canal general de PYR",
  author: "El Rey Supremo"
}]

var suministro = [{
  latitud:0,
  longitud:0
}]

var publicConfig = {
  key: 'AIzaSyD_wkz5lw2oywmDcQwQu4CZRnr6KaMq9WE',
  stagger_time:       1000, // for elevationPath
  encode_polylines:   false,
  secure:             true, // use https,
};
var gmAPI = new GoogleMapsAPI(publicConfig);

// comenzamos a escuchar
io.on('connection',function(socket){
  console.log("Alguien se ha conectado");
  // CHAT //
  // emitimos el evento para que lo escuche el socket
 /* socket.emit('messages',messages);
  // escuchamos el evento de nuevo mensaje y hacemos algo con los datos que nos pasan
  socket.on('newmessage',function(data){
  // añadimos en el array mensajes ese nuevo mensaje
      messages.push(data);
  io.sockets.emit('messages',messages); // enviamos el mensaje a todos los clientes conectados al socket!
  console.log(`${data.author} ha escrito "${data.text}"`);
  });*/

  // escuchamos el evento de nueva recolecta y hacemos algo con los datos que nos pasan
  socket.on('newRecolecta',function(data){
    // añadimos en el array mensajes ese nuevo mensaje
      suministro[0].latitud = data.latitud;
      suministro[0].longitud = data.longitud;
      async function recoleccion(){
         var juego = await game.recolectaCliente(suministro);
        //console.log(juego);
        io.sockets.emit('suministros',juego);
        //socket.emit('suministros',suministro); // enviamos el mensaje solo al cliente escuchando
        
        var reverseGeocodeParams = {
          "latlng":        suministro[0].latitud+","+suministro[0].longitud,
          "result_type":   "postal_code",
          "language":      "es",
          "location_type": "APPROXIMATE"
        };
         
        gmAPI.reverseGeocode(reverseGeocodeParams, function(err, result){
          console.log(result);
          console.log(result.results[0].formatted_address);
          
          var params = {
            center: result.results[0].formatted_address,
            zoom: 15,
            size: '500x400',
            maptype: 'roadmap',
            markers: [
              {
                location: result.results[0].formatted_address,
                label   : 'A',
                color   : 'green',
                shadow  : true
              },
              {
                location: result.results[0].formatted_address,
                icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=cafe%7C996600'
              }
            ],
            style: [
              {
                feature: 'road',
                element: 'all',
                rules: {
                  hue: '0x00ff00'
                }
              }
            ],
            /*path: [
              {
                color: '0x0000ff',
                weight: '5',
                points: [
                  '41.139817,-77.454439',
                  '41.138621,-77.451596'
                ]
              }
            ]*/
          };
          gmAPI.staticMap(params); // return static map URL
          gmAPI.staticMap(params, function(err, binaryImage) {
            // fetch asynchronously the binary image
          });
          console.log(gmAPI.staticMap(params));
        });
      }
      recoleccion();
     
    });
});

// Por otro lado tendrá que haber una página web con un código javascript que envíe ese mensaje "connection"
// Ello se creará en la carpeta public

// para poder usar la parte pública usaremos un middleware que trae express y que se llama Static (ver línea 14 app.use....)

// Esto siempre al final para que el servidor se ponga a escuchar
/*server.listen(1231, function(){
  console.log("Servidor funcionando en http://localhost:1231");
});*/
// para ejecutarlo, desde consola, node server/main.js

/////////////// fin sockets ///////////////


// MIDDLEWARES (definimos esto antes de Routes)

// Son las funciones a ejecutar antes del enrutado

app.use(morgan('dev')); // queremos que ante cada petición del cliente se ejecute morgan y nos muestre los mensajes a nivel "dev". Hay más opciones
// Hecho esto, si lanzamos una petición al servidor desde cualquier navegador, veremos cómo morgan muestra GET / 200.... mensajes de estado de las peticiones

// configuración típica de sesión
app.use(session({
  secret:'mysecretsession',
  resave: false,
  saveUninitialized: false
}));

//connect-flash
app.use(flash()); // ha de ir antes de passport y después de las sesiones ya que hace uso de ellas

// inicializamos passport
app.use(passport.initialize());

// inicializamos la sesión
app.use(passport.session()); // Almacenamos datos en la sesión

// en public irán todos los ficheros estáticos de la página
app.use(express.static('public'));

app.use(express.urlencoded({extended: false})); // Este middleware nos ayudará a debuggear durante el POST

// este middleware es propio, dentro ya usamos flash
app.use(((req,res,next)=>{
  app.locals.signupMessage = req.flash('signupMessage'); // guarda los mensajes, si existen, en la variable local (accesible para toda la aplicación)
  app.locals.signinMessage = req.flash('signinMessage'); // guarda los mensajes, si existen, en la variable local (accesible para toda la aplicación)

  // Almacenamos la variable user en una variable local accesible desde toda la aplicación
  app.locals.user = req.user;

  return next(); // pasa al siguiente paso (callback)
  //en la plantilla ejs usaremos una validadción (signup.ejs)
}));

// Routes
// Le decimos a express que utilice las rutas definidas por nosotrs cada vez que un usuario acceda al /
app.use('/',require('./routes/index.js'));

// start listening

// aquí comienzo a escuchar por el puerto que sea, y a parte lo imprimo por consola

var port = process.env.PORT || 3200; // con esto le digo que coja el puerto por defecto y si está ocupado que coja el 3000
  
  /*app.listen(port, function () {
    console.log('Servidor escuchando a través del puerto %d', port);
  }); */

  server.listen(port, function () {
    console.log('Servidor escuchando a través del puerto %d', port);
  }); 