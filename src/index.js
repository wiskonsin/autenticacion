const express = require('express');
const engine = require('ejs-mate');
const path = require('path'); // con esta librería manejamos los paths más fácilmente
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');

// Inicializaciones
const app = express();
require('./database');
require('./passport/local-auth')


// settings
app.set('views', path.join(__dirname,'views')); // defino dónde está la carpeta de vistas
// con .join(__dirname) obtengo el directorio actual en donde está este fichero index.js
//finalmente lo concateno con la carpeta 'views'
app.engine('ejs',engine); // usa el motor de plantillas que acabamos de definir
app.set('view engine', 'ejs');


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

var port = process.env.PORT || 3000; // con esto le digo que coja el puerto por defecto y si está ocupado que coja el 3000

  
  app.listen(port, function () {
    console.log('Servidor escuchando a través del puerto %d', port);
  }); 