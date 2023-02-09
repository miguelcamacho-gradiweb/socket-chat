import Usuarios from "../classes/usuarios";
import { crearMensaje } from "../utils/utils";

const usuarios = new Usuarios()

export const socketController = (socket ,io) => {
    // el io me sirve para emitir a todo y a mi principalmente
    socket.on('entrarChat', (payload, callback)=>{ 
        if ( !payload.nombre) {
            return callback({
                error: true,
                mensaje: 'The name is necessary'
            })
        }
        //para unirlo a una sala
        socket.join(payload.sala)

        let personas = usuarios.agregarPersonas( socket.id, payload.nombre, payload.sala)

        //llamo a  todas las personas
        socket.broadcast.to(payload.sala).emit('listaPersonas', usuarios.getPersonasPorSalas(payload.sala))
        socket.broadcast.to(payload.sala).emit('crearMensaje', crearMensaje('Administrador', `${payload.nombre} se unio`))

        callback(usuarios.getPersonasPorSalas(payload.sala))
    })

    socket.on('crearMensaje',  (data, callback)=>{
        let persona = usuarios.getPersona( socket.id )
        let mensaje = crearMensaje( data.nombre, data.mensaje)
        socket.broadcast.to(persona.sala).emit('crearMensaje', mensaje)

        callback(mensaje)
    })

    socket.on('disconnect', ()=>{
        let  personaBorrada= usuarios.borrarPersona( socket.id )
        socket.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje(personaBorrada.nombre, `${personaBorrada.nombre} salio`))
        socket.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonasPorSalas(personaBorrada.sala))
    })

    // mensajes privados
    socket.on('mensajePrivado', data =>{
        let persona = usuarios.getPersona(socket.id)
        socket.broadcast.to(data.para).emit('mensajePrivado', crearMensaje( persona.nombre, data.mensaje))
    })
}