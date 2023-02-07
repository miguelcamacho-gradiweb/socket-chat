
const socket = io()

let params = new URLSearchParams(window.location.search)

let usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}

if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html'
    throw new Error('El nombre osala es nesesario')
}

socket.on('connect', ()=>{
    socket.emit('entrarChat', usuario, function(resp){
        console.log('Usuario connected', resp);
    })    
})

socket.on('disconnect', ()=>{
})

socket.on('crearMensaje', payload =>{
    console.log(payload);
})

// listening changes of users
socket.on('listaPersonas', payload =>{
    console.log(payload,'este es el numero de personas conectas');
})

// socket.emit('crearMensaje', usuario)


//mensajes privados

socket.on('mensajePrivado', function(mensaje){
    console.log('Mensaje Privado', mensaje)
})


