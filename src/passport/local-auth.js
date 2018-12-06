const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; // recogemos la estrategia de autenticación de passport-local

const User = require('../models/user.js'); // llamamos a user.js


// Almacenamiento de sesiones en navegador con passport, con serialize y deserialize

passport.serializeUser((user,done) => {
   return done(null,user.id);
})

passport.deserializeUser(async (id,done) => {
   const user = await User.findById(id);
  return done(null, user);
})

// con estos dos métodos lo que hacemos es pasarnos entre las diferentes páginas del navegador el ID del usuario, y hacer una consulta a base de datos para recibir los datos del usurio continuamente


// Ahora creamos una función que defina lo que hacer cuando recibamos los datos del cliente
// definimos el método local-signup
// LocalStrategy recibe dos parámetros, por un lado un objeto de configuración (datos que recibo del cliente) y un callback de ejecución (qué hago con esos datos). 
passport.use('local-signup', new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // para pasarle todos los datos, no sólo los indicados
    },
   async(req, email, password, done) => {

        // Validación usuario
        // Comprobamos si existe el email en la base de datos
        const user = await User.findOne({ email : email});
        if(user){

                // devolvemos null porque no hay error, false porque no devolvemos usuario y un mensaje con connect-flash
                // hacer require en el index.js de src y usarlo como middleware
                // el flash recibe 2 parámetros, el nombre de la variable mensaje y el mensaje
                return done(null, false, req.flash('signupMessage','El email ya existe.'));
                // este mensaje hemos de mostrarlo a través de index.js antes de routes

        } // Buscar en base de datos un email que coincida con el email que ha introducido el usuario
        else{
                const newUser = new User();
                newUser.email = email;
                newUser.password = newUser.encryptPassword(password);
                await newUser.save();
               return done(null,newUser);

        }
       
    }));

    // req -> envía todo, no sólo email y password, si no todo lo que se envíe
    // done es un callback para devolverle una respuesta al cliente de que está todo ok

    ///// Ahora hacemos lo mismo pero para el signin


    passport.use('local-signin', new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // para pasarle todos los datos, no sólo los indicados
        },
       async(req, email, password, done) => {
    
            // Validación usuario
            const user = await User.findOne({ email : email});
            // Comprobamos si existe el email en la base de datos
            if(!user){
                    console.log("email no registrado");
                    // Comprobamos si el email está registrado
                    return done(null, false, req.flash('signinMessage','El email no está registrado.'));
                    // este mensaje hemos de mostrarlo a través de index.js antes de routes
    
            }
            // Comprobamos el password
            if(user.comparePassword(password)){
                console.log("password ok");
                return done(null,user); // resultado ok, devuelvo null porque no hay error y el usuario

                 // este mensaje hemos de mostrarlo a través de index.js antes de routes   
            }
            else{
                console.log("mal password");
                return done(null, false, req.flash('signinMessage','Password incorrecto.'));

            }
           
           
        }));