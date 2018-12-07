const express = require('express'); // requerimos express no para montar el servidor si no para tomar las rutas

const passport = require('passport');

const router = express.Router(); // Devuelve objeto con las rutas del servidor

// Definimos las rutas

router.get('/',(req, res, next) =>{
 res.render('index'); // dada la configuración de index.js en src, ya coge el fichero index del views
}); // cuando el usuario ingrese en la carpeta raíz /, manejaremos la petición con un request un response y un next, con el método get

router.get('/signup',(req, res, next) =>{
    res.render('signup');


}); // cuando el usuario ingrese en la carpeta  /signup, manejaremos la petición con un request un response y un next, con el método get

router.get('/comeback',(req, res, next) =>{
    res.render('comeback');
}); // cuando el usuario ingrese en la carpeta  /comeback, manejaremos la petición con un request un response y un next, con el método get

router.get('/app',(req, res, next) =>{
    res.render('app');
}); // cuando el usuario ingrese en la carpeta  /comeback, manejaremos la petición con un request un response y un next, con el método get

router.post('/signup', passport.authenticate('local-signup',{
    //redireccionamos al usuario
    successRedirect: '/profile',
    failureRedirect: '/signup',
    passReqToCallback: true
}));
// con post cuando se envíen los datos de signup
// usamos local-signup definida en passport/local-auth.js

// lo mismo para el signin

router.get('/signin',(req, res, next) =>{

    res.render('signin');


}); // cuando el usuario ingrese en la carpeta  /signin, manejaremos la petición con un request un response y un next, con el método get

router.get('/comeback',(req, res, next) =>{

    res.render('comeback');


});

// con la autenticación de passport redireccionamos a profile
router.post('/signin', passport.authenticate('local-signin',{
    //redireccionamos al usuario
    successRedirect: '/profile',
    failureRedirect: '/signin',
    passReqToCallback: true
})); // con post cuando se envíen los datos de signin

// creamos ruta para el logout

router.get('/logout', (req, res, next) => {
    req.logout();
    res.render('comeback'); // creamos vista llamada comeback
    next();
});

// pero aún no se está creando la autenticación

// vista de profile
// Con isAuthenticated en medio protegemos la ruta
router.get('/profile',isAuthenticated, (req, res, next) => {
    res.render('profile'); // creamos vista llamada profile


});

// otra opción es, creando desde aquí un middleware, todas las rutas que estén debajo, tendrán que estar autenticadas, si no, no funcionarán

/*router.use((req,res,next)=>{
    isAuthenticated(req,res,next);
    next();
    res.end(); // este res.end() se pone para acabar y que no se quede aquí para siempre, si hay debajo cosas, se quita
});*/

//// a partir de aquí las rutas que quiera proteger (usar si hay más de una)//

// creamos función para comprobar autenticación en cada reenrutado
// irá en los middlewares
// esta función la incluiremos en cada router.get

function isAuthenticated(req,res,next) {

    if(req.isAuthenticated()){
        return next(); // continúa a la siguiente ruta
    }
    else{
        return res.redirect('/signin');
    }
};

module.exports = router;
// lo exportamos para utilizarlo en otros archivos