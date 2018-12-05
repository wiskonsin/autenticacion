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


router.post('/signin', passport.authenticate('local-signin',{
    //redireccionamos al usuario
    successRedirect: '/profile',
    failureRedirect: '/signin',
    passReqToCallback: true
})); // con post cuando se envíen los datos de signin

// vista de profile

router.get('/profile', (req, res, next) => {
    res.render('profile'); // creamos vista llamada profile
});

module.exports = router;
// lo exportamos para utilizarlo en otros archivos