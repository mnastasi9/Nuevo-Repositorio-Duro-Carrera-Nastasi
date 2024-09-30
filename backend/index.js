// Carga las librerías necesarias
const express = require('express');
const bodyParser = require('body-parser');
const MySql = require('./modulos/mysql');
const session = require('express-session');
const cors = require('cors'); // Agrega esta línea

const app = express();
app.use(cors({ // Configura CORS
    origin: ["http://localhost:3000", "http://localhost:3001"], // Orígenes permitidos
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
    credentials: true // Habilitar el envío de cookies
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const LISTEN_PORT = 4000;

const server = app.listen(LISTEN_PORT, () => {
    console.log(`Servidor NodeJS corriendo en http://localhost:${LISTEN_PORT}/`);
});

const io = require('socket.io')(server, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:3001"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }
});

const sessionMiddleware = session({
    //Elegir tu propia key secreta
    secret: "supersarasa",
    resave: false,
    saveUninitialized: false
});

app.use(sessionMiddleware);

io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});


/**
 * req = request. en este objeto voy a tener todo lo que reciba del cliente
 * res = response. Voy a responderle al cliente
 */

//parte usuario
app.get('/obtenerUsers', async function (req, res) {
    const respuesta = await MySql.realizarQuery('SELECT * FROM Users;')
    res.send(respuesta)
})

app.post('/usuarios', async function (req, res) {
    let respuesta = ""
    if (req.body.nombre_usuario) {
        respuesta = await MySql.realizarQuery(`SELECT * FROM Users WHERE 
        nombre = "${req.body.nombre_usuario}" and contraseña = "${req.body.contraseña}";`)
    }
    else {
        respuesta = ""
    }
    res.send(respuesta)

})

app.post('/usuarioexiste', async function (req, res) {
    let respuesta = ""
    if (req.body.nombre_usuario) {
        respuesta = await MySql.realizarQuery(`SELECT * FROM Users WHERE 
        nombre = "${req.body.nombre_usuario}"`)
    }
    else {
        respuesta = await MySql.realizarQuery(`SELECT * FROM Users;`)
    }
    res.send(respuesta)

})

app.post('/insertarUsuario', async function (req, res) {
    var usuarioNuevo = await MySql.realizarQuery(`SELECT * FROM Users WHERE nombre = '${req.body.nombre_usuario}'`);
    if (usuarioNuevo.length == 0) {
        await MySql.realizarQuery(`INSERT INTO Users (nombre, contraseña, avatar, descripcion) 
        VALUES ('${req.body.nombre_usuario}', '${req.body.contraseña}','imagenes/usuario.png', 'nuevo usuario' )`);
        res.send({ status: "Ok" })
    } else {
        res.send({ status: "Ya existe" });
    }
})

app.delete('/eliminarUsuario', async function (req, res) {
    await MySql.realizarQuery(`DELETE FROM Users WHERE id = ${req.body.id_usuario}`);
    res.send("ok")
})


//parte chat_users

app.post('/Chat_Users', async function (req, res) {
    let respuesta = ""

    if (req.body.id_usuario) {
        let idChatsUsuario = await MySql.realizarQuery(`
            SELECT id_chat FROM Chat_Users WHERE id_users = "${req.body.id_usuario}";
        `);
        let idsChatArray = idChatsUsuario.map(chat => chat.id_chat);
        if (idsChatArray.length > 0) {
            respuesta = await MySql.realizarQuery(`
                SELECT * FROM Chat_Users 
                WHERE id_chat IN (${idsChatArray.join(",")})
                AND id_users != "${req.body.id_usuario}";
            `);
        } else {
            respuesta = [];
        }
    } else {
        respuesta = [];
    }

    res.send(respuesta);
});

app.post('/codigoConexion', async function (req, res) {
    let respuesta = ""

    if (req.body.id_usuario) {
        let idChatsUsuario = await MySql.realizarQuery(`
            SELECT id_chat FROM Chat_Users WHERE id_users = "${req.body.id_usuario}";
        `);
        let idsChatArray = idChatsUsuario.map(chat => chat.id_chat);
        if (idsChatArray.length > 0) {
            respuesta = await MySql.realizarQuery(`
                SELECT * FROM Chat 
                WHERE id IN (${idsChatArray.join(",")});
            `);
        } else {
            respuesta = [];
        }
    } else {
        respuesta = [];
    }

    res.send(respuesta);
});

//parte chat
app.get('/obtenerChat', async function (req, res) {
    const respuesta = await MySql.realizarQuery('SELECT * FROM Chat;')
    res.send(respuesta)
})


app.post('/Chat', async function (req, res) {
    let respuesta = ""
    if (req.body.id_usuario) {
        respuesta = await MySql.realizarQuery(`SELECT * FROM Chat WHERE 
        id = "${req.query.id_usuario}";`)
    }
    else {
        respuesta = await MySql.realizarQuery(`SELECT * FROM Chat;`)
    }
    res.send(respuesta)

})

io.on("connection", (socket) => {
    const req = socket.request;

    socket.on('joinRoom', data => {
        console.log("🚀 ~ io.on ~ req.session.room:", req.session.room)
        if (existeSala(data.room)) {
            if (req.session.room != undefined && req.session.room.length > 0)
                socket.leave(req.session.room);
            req.session.room = data.room;
            socket.join(req.session.room);
            console.log("entraste")
            io.to(req.session.room).emit('entroSala', { room: req.session.room, success: true });
        }
        else {
            codigos.push(data.room)
            req.session.room = data.room;
            socket.join(req.session.room);
            io.to(req.session.room).emit('salaCreada', { room: req.session.room, success: true });
        }

    });

    socket.on('pingAll', data => {
        console.log("PING ALL: ", data);
        io.emit('pingAll', { event: "Ping to all", message: data });
    });

    socket.on('sendMessage', data => {
        io.to(req.session.room).emit('newMessage', { room: req.session.room, message: data });
    });

    socket.on('disconnect', () => {
        console.log("Disconnect");
    })

    socket.on(`enviarMensaje`, () => {
        io.to(req.session.room).emit('newMessage', { room: req.session.room, message: data });
    })    

    // socket.on(`conectarSala`, data => {
    //     console.log(data)
    //     if (data.hasOwnProperty(`room`)) {
    //         codigos.push(data.room)
    //     }
    //     //MySql.realizarQuery()
    //     if (req.session.room != undefined && req.session.room.length > 0)
    //         socket.leave(req.session.room);
        
    // })

});


function existeSala(room) {
    for (let index = 0; index < codigos.length; index++) {
        if (data.room == codigos[index]) {
            return true
        }
    }
    return false
}

const codigos = []
/*app.put('/modificarChat_Users', async function(req,res){
    console.log(req.body)
    await MySql.realizarQuery(`UPDATE Chat_Users SET puntaje_partida = '${req.body.puntaje_partida}' WHERE id_partida= ${req.body.id_partida}`);
    res.send("ok")
})
app.put('/modificarUsuarioPuntaje', async function(req,res){
    console.log(req.body)
    response = await MySql.realizarQuery(`SELECT puntaje_usuario FROM Usuarios WHERE id_usuario= ${req.body.id_usuario}`);
    await MySql.realizarQuery(`UPDATE Usuarios SET puntaje_usuario = '${req.body.puntaje_usuario + response[0].puntaje_usuario}' WHERE id_usuario= ${req.body.id_usuario}`);
    res.send({puntaje: req.body.puntaje_usuario + response[0].puntaje_usuario})
})
app.put('/modificarUsuarioPartidasganadas', async function(req,res){
    console.log(req.body)
    response = await MySql.realizarQuery(`SELECT partidas_ganadas FROM Usuarios WHERE id_usuario= ${req.body.id_usuario}`);
    await MySql.realizarQuery(`UPDATE Usuarios SET partidas_ganadas = '${req.body.partidas_ganadas + response[0].partidas_ganadas}' WHERE id_usuario= ${req.body.id_usuario}`);
    res.send({ganadas: req.body.partidas_ganadas + response[0].partidas_ganadas})
})

app.put('/modificarUsuarioPartidasperdidas', async function(req,res){
    console.log(req.body)
    response = await MySql.realizarQuery(`SELECT partidas_perdidas FROM Usuarios WHERE id_usuario= ${req.body.id_usuario}`);
    await MySql.realizarQuery(`UPDATE Usuarios SET partidas_perdidas = '${req.body.partidas_perdidas + response[0].partidas_perdidas}' WHERE id_usuario= ${req.body.id_usuario}`);
    res.send({perdidas: req.body.partidas_perdidas + response[0].partidas_perdidas})
})

app.delete('/eliminarPartida', async function(req,res){
    console.log(req.body)
    await MySql.realizarQuery(`DELETE FROM Partidas WHERE id_partida = ${req.body.id_partida}`);
    res.send("ok")
})*/
