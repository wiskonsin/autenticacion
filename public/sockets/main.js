var socket = io.connect('//autenticacionluis.herokuapp.com:443', {'forceNew': true}); // para conectarnos al servidor de sockets, con ello ya creamos la conexión

socket.on('messages', function(data){
    console.log(data);
    render(data); // llamamos a la función render que hemos creado más abajo

}); // evento que queremos escuchar (messages)

// esta función es llamada desde el form y recoge la información de los inputs
// y posteriormente emite el mensaje hacia el servidor a través del socket

function addMessage(e){
    var payload = {
        author: document.getElementById("username").value,
        text: document.getElementById("texto").value
    };

    socket.emit('newmessage',payload); // emitimos el evento newmessage con el contenido payload
}

function render(data){
    // Con la notación `` nos permite escribir lo que queramos en el string, dentro de las comillas
    // Con ${} puedo meter todo lo que esté en la variable
    var html = data.map(function(elem, index){
        return( `<div>
        <strong>${elem.author}</strong>:
        <em>${elem.text}</em>
    </div>`);
    }).join(" "); // con join lo separamos con espacios en este caso
    
    
   
    document.getElementById("messages").innerHTML = html;
}