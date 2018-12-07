https://www.youtube.com/watch?v=uVltgEcjNww

Para crear el proyecto con su descripción etc:

npm init --yes

Posteriormente instalamos todos los plugins necesarios para el proyecto

// npm i mongoose (driver para acceder a mongodb)
// npm i ejs-mate (motor de plantillas)
// npm i  connect-flash (comunicacion entre páginas)
// npm i morgan para ver peticiones del cliente por consola
// npm i passport
// npm i passport-local (autenticación local en el servidor)
// npm i bcrypt-nodejs

npm i express mongoose ejs-mate connect-flash morgan passport passport-local bcrypt-nodejs

// instalar mongodb

npm i nodemon -D (para instalarlo en la parte de desarrollador (dev dependencies), así en pro no se instalará)

// Creamos carpeta scr con todo
index.js fichero principal que arrancará nuestro servidor
/routes carpeta para poder escribir rutas del servidor (urls)
database.js para conectarnos a la base de datos
keys.js encargado de contener usuarios, dirección base datos... para poder migrar de un sitio a otro fácilmente

models para modelar base de datos

/passport carpeta para futuras nuevas autenticaciones

en index.js ejecutamos express

en package.json modificamos la parte de scripts para que se ejecute nodemon con index.js cuando se haga "node run dev"

Tras ejecutar eso, al no tener rutas, devolverá que Cannot Get en el navegador a través del puerto 3000 en localhost

Creamos en routes/index.js el fichero para definir todas las rutas de nuestro servidor

Creamos en la carpeta raíz una carpeta /views que contenga las vistas (todos los archivos html). Usaremos el ejs-ms (ver el require en el index.js del /src)
Ver cómo configuramos las settings de la aplicación en index.js de src

Además hemos de importar y requerir las rutas para decirle a express lo que tiene qué hacer cuando el usuario acceda a /

Creamos index.ejs dentro de views (comprobar qué sucede si entramos a localhost:3000 desde un navegador)

Con morgan, podemos ir viendo lo que cada usuario va pidiendo al servidor. Lo requerimos en el index.js del src

También crearemos los middlewares, que son funciones que se ejecutan antes de que se pasen a las rutas (para procesar lo que pase el cliente). Siempre antes de las rutas, ahí le decimos entre otras cosas que use morgan para que se muestren los estados de la peticiones del cliente al servidor

Creamos nueva vista para signup y signin

En signup, crearemos un formulario con 2 inputs, uno para el correo y otro para la contraseña.
El formulario llevará a /signup mediante el método POST, cosa ya definida en las rutas

En middlewares (src/index.js) vamos a indicar a Express que envíe información del POST para poder debuggear.

En routes, hemos de definir qué hacer durante el POST en signup

Queremos procesar los datos con passport. Describiremos nuestro primer método de autenticación

Utilizaremos el método local en este caso. Creamos local-auth.js

En database.js crearemos la conexión con la base de datos.
Usaremos mongoose para conectarnos a mongodb

En keys.js creamos todas las conexiones y datos que puedan ser exportables

En src/index.js tenemos las inicializaciones, ahí incluimos también la conexión a BBDD mongodb

///// La última versión de mongoose trae algún error, podemos instalar la versión 5.2.8 que es estable

// para eliminar -> npm remove mongoose y después npm i mongoose@5.2.8

// En models creamos cómo quedarán registrados los usuarios en base de datos. Usaremos user.js

También hemos de encriptar el password, usaremos bcrypt (en el mismo user.js)
Y por supuesto desencriptarlo.

Tras haber creado los métodos en user.js, hemos de usarlos en local-auth.js.
Además utilizaremos los métodos serialize y deserialize para pasar el id de usuario entre las diferentes páginas y no perder la sesión.

En index.js inicializamos passport también

Y además hemos de incluirlo como middleware ya que será el encargado de validar si el usuario está autenticado o no, almacenando los datos en la sesión

Hay que instalar el módulo express-session, y hacer require también en el src/index.js porque tendremos que ir almacenando las sesiones a parte de configurarla previamente

Ahora ya podemos enrutar correctamente el POST del signup, requerir passport en routes/index.js y en el POST llamamos a passport para que gestione la sesión

podemos hacer prueba en signup para ver si funciona, introduciendo usuario y contraseña y posteriormente comprobando en mongodb si se ha guardado

escribo en terminal mongo y después use node-login-passport-local
posteriormente show collections para ver las colecciones de datos que hay (tiene que estar users)
por último, db.users.find() y se muestran todos los resultados en la colección

Validación de correo electrónico del signup en local-auth -> buscamos en bbdd si el usuario ya está, y aprovechamos connect-flash para mostrar errores en caso de que sea necesario (a través de ejs)

Lo mismo para el signin, comprobamos si se realiza el loggeo correctamente

Modificamos plantillas ejs de signin y signup

Vamos a crear un layout para todas nuestras vistas, todo lo que se muestre de forma repetida irá ahí. main.ejs

En nuestras plantillas ejs, incluiremos ese layout

En las rutas renderizaremos la plantilla signin.ejs cuando accedamos a signin

Hemos de crear una ruta también para el logout, en el index.js del routes

Para que la autenticación funcione correctamente y bloquee las routes que no queramos, hay que crear un middleware que compruebe la autenticación continuamente. Se crea en el index.js de routes
Función es isAuthenticated. La incluímos en cada get o bien creamos un middleware en el propio index.js de routes, un req.use justo antes de las rutas que queremos "securizar". Tiene sentido si hay más de una

// ESTILOS //

Simplemente con bootstrap, en main.ejs vamos a añadir el CDN

Ojo con bootswatch, hay themes muy guapos

Para mostrar diferentes menús o lo que sea en función de si estoy logeado o no, voy a index.js
Teniendo en cuenta que una vez autenticado, passport guarda la autenticacion en req.user, lo guardamos en una variable local accesible desde toda la aplicación

Hecho eso, en la vista main.ejs hago la comparación para que muestre un menú u otro

////

Instalamos sockets

////

