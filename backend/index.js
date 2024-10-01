const express = require('express');
const bodyParser = require('body-parser');
const MySql = require('./modulos/mysql');
const session = require('express-session');
const cors = require('cors'); 

const app = express();
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "PUT", "DELETE"], 
    credentials: true 
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
    secret: "supersarasa",
    resave: false,
    saveUninitialized: false
});

app.use(sessionMiddleware);

io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});


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

app.post('/insertarMensaje', async function (req, res) {
    await MySql.realizarQuery(`INSERT INTO Mensajes (userId, mensaje, userRecibe, time) 
    VALUES (${req.body.userId}, '${req.body.mensaje}', ${req.body.userRecibe}, '${req.body.time}')`);
    res.send({ status: "Ok" })
})

app.get('/obtenerMensajes', async function (req, res) {
    const respuesta = await MySql.realizarQuery('SELECT * FROM Mensajes;')
    res.send(respuesta)
})

app.delete('/eliminarUsuario', async function (req, res) {
    await MySql.realizarQuery(`DELETE FROM Users WHERE id = ${req.body.id_usuario}`);
    res.send("ok")
})



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

app.post('/modificarSeen', (req, res) => {
    const { userId, userRecibe } = req.body;

    const query = 'UPDATE mensajes SET seen = ? WHERE userId = ? AND userRecibe = ?';
    connection.query(query, ['seenVisto', userId, userRecibe], (error, results) => {
        if (error) {
            return res.status(500).send('Error actualizando registros: ' + error);
        }
        res.send('Registros actualizados correctamente.');
    });
});

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

    socket.on('leaveRoom', () => {
        socket.leave(req.session.room);
        console.log("Disconnect");
    })

    socket.on(`enviarMensaje`, () => {
        io.to(req.session.room).emit('newMessage', { room: req.session.room, message: data });
    })    

});


function existeSala(room) {
    for (let index = 0; index < codigos.length; index++) {
        if (room == codigos[index]) {
            return true
        }
    }
    return false
}

const codigos = []