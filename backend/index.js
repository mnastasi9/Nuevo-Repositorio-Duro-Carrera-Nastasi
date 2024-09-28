const express = require('express');						// Para el manejo del web server
const bodyParser = require('body-parser'); 				// Para el manejo de los strings JSON
const MySQL = require('./modulos/mysql');				// Añado el archivo mysql.js presente en la carpeta módulos
const session = require('express-session');				// Para el manejo de las variables de sesión

const app = express();									// Inicializo express para el manejo de las peticiones

app.use(bodyParser.urlencoded({ extended: false }));	// Inicializo el parser JSON
app.use(bodyParser.json());

const LISTEN_PORT = 4000;								// Puerto por el que estoy ejecutando la página Web

const server = app.listen(LISTEN_PORT, () => {
	console.log(`Servidor NodeJS corriendo en http://localhost:${LISTEN_PORT}/`);
});;

const io = require('socket.io')(server, {
	cors: {
		// IMPORTANTE: REVISAR PUERTO DEL FRONTEND
		origin: ["http://localhost:3000","http://localhost:3001"],            	// Permitir el origen localhost:3000
		methods: ["GET", "POST", "PUT", "DELETE"],  	// Métodos permitidos
		credentials: true                           	// Habilitar el envío de cookies
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

//parte usuario
app.get('/obtenerUsers', async function(req,res){
    console.log(req.query) 
    const respuesta = await MySql.realizarQuery('SELECT * FROM Users;')
    console.log({respuesta})
    res.send(respuesta)
})

app.post('/usuarios', async function(req,res){
    console.log(req.body)
    let respuesta = ""
    if (req.body.nombre_usuario) {
         respuesta = await MySql.realizarQuery(`SELECT * FROM Users WHERE 
        nombre = "${req.body.nombre_usuario}" and contraseña = "${req.body.contraseña}";`)
    }
    else{
        respuesta = ""
    }
    res.send(respuesta) 
   
})

app.post('/usuarioexiste', async function(req,res){
    console.log(req.body)
    let respuesta = ""
    if (req.body.nombre_usuario) {
         respuesta = await MySql.realizarQuery(`SELECT * FROM Users WHERE 
        nombre = "${req.body.nombre_usuario}"`)
    }
    else{
         respuesta = await MySql.realizarQuery(`SELECT * FROM Users;`)
    }
    res.send(respuesta) 
   
})

app.post('/insertarUsuario', async function(req,res) {
    console.log(req.body)
    var usuarioNuevo = await MySql.realizarQuery(`SELECT * FROM Users WHERE nombre = '${req.body.nombre_usuario}'`);
    if (usuarioNuevo.length==0) {
        await MySql.realizarQuery(`INSERT INTO Users (nombre, contraseña, avatar, descripcion) 
        VALUES ('${req.body.nombre_usuario}', '${req.body.contraseña}','imagenes/usuario.png', 'nuevo usuario' )`);
        res.send({status: "Ok"})
    } else {
        res.send({status: "Ya existe"});
    }
})

app.delete('/eliminarUsuario', async function(req,res){
    console.log(req.body)
    await MySql.realizarQuery(`DELETE FROM Users WHERE id = ${req.body.id_usuario}`);
    res.send("ok")
})


//parte chat_users
app.get('/obtenerChat_Users', async function(req,res){
    console.log(req.query) 
    const respuesta = await MySql.realizarQuery('SELECT * FROM Chat_Users;')
    console.log({respuesta})
    res.send(respuesta)
})


app.post('/Chat_Users', async function(req,res){
    console.log(req.body)
    let respuesta = ""
    if (req.body.id_usuario) {
         respuesta = await MySql.realizarQuery(`SELECT * FROM Chat_Users WHERE 
        id_users = "${req.query.id_usuario}";`)
    } 
    else{
         respuesta = await MySql.realizarQuery(`SELECT * FROM Chat_Users;`)
    }
    res.send(respuesta) 
   
})

io.on("connection", (socket) => {
    const req = socket.request;

    socket.on('joinRoom', data => {
        console.log("🚀 ~ io.on ~ req.session.room:", req.session.room)
        if (data.room == codigos.room) {
            if (req.session.room != undefined && req.session.room.length > 0)
                socket.leave(req.session.room);
            req.session.room = data.room;
            socket.join(req.session.room);
            console.log("entraste")
            io.to(req.session.room).emit('entroSala', { room: req.session.room, success: true });

        } else {
            console.log("hola", codigos)
            io.to(req.session.room).emit('salaNoExiste', { room: req.session.room, success: false });
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
});

