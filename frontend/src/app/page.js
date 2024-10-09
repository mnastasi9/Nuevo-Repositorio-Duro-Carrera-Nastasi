"use client"; // Indica que este archivo debe ejecutarse en el lado del cliente (browser).

import { useEffect, useState } from 'react'; // Importa hooks de React para manejar efectos y estado.
import ContactList from '../components/ContactList'; // Importa el componente ContactList desde la ruta especificada.
import Chat from '../components/Chat'; // Importa el componente Chat desde la ruta especificada.
import styles from './page.module.css'; // Importa los estilos CSS de la hoja de estilos local.
import { useSocket } from "@/hooks/useSocket"; // Importa el hook useSocket para gestionar conexiones de socket.

const ChatInterface = () => { // Define el componente funcional ChatInterface.
  const [messages, setMessages] = useState([]); // Inicializa el estado para los mensajes del chat.
  const [inputValue, setInputValue] = useState(''); // Inicializa el estado para el valor del input del mensaje.
  const [currentChat, setCurrentChat] = useState(null); // Inicializa el estado para el chat actual seleccionado.
  const [searchTerm, setSearchTerm] = useState(''); // Inicializa el estado para el término de búsqueda en la lista de contactos.
  const [userAvatar, setUserAvatar] = useState(null); // Inicializa el estado para el avatar del usuario.
  const [userId, setUserId] = useState(null); // Inicializa el estado para el ID del usuario.
  const [contacts, setContacts] = useState([]); // Inicializa el estado para la lista de contactos.
  const [contactsFiltrado, setContactsFiltrado] = useState([]); // Inicializa el estado para los contactos filtrados según la búsqueda.
  const [chatUsers, setChatUsers] = useState([]); // Inicializa el estado para los usuarios del chat.
  const [hasFetchedContacts, setHasFetchedContacts] = useState(false); // Indica si ya se han obtenido los contactos.
  const [hasFetchedChatUsers, setHasFetchedChatUsers] = useState(false); // Indica si ya se han obtenido los usuarios del chat.
  const [hasFetchedChats, setHasFetchedChats] = useState(false); // Indica si ya se han obtenido los chats.
  const [codigosConexion, setCodigosConexion] = useState([]); // Inicializa el estado para los códigos de conexión de los chats.
  const [ConexionContacto, setConexionnContacto] = useState([]); // Inicializa el estado para las conexiones de los contactos.
  const { socket, isConnected } = useSocket(); // Obtiene el socket y su estado de conexión.

  useEffect(() => { // Efecto para manejar eventos de socket.
    if (!socket) return; // Si no hay socket, no hace nada.

    socket.on("newMessage", (mensaje) => { // Escucha el evento "newMessage" y guarda el mensaje recibido.
      guardarMensaje(mensaje, userId);
    });

    console.log("cambioSocket"); // Mensaje de depuración en la consola.
    socket.on("nuevoVisto", (mensaje) => { // Escucha el evento "nuevoVisto" para cargar mensajes.
      console.log("lo vi marche"); // Mensaje de depuración en la consola.
      cargarMensajes(); // Llama a la función para cargar mensajes.
    });

    return () => { // Limpieza del efecto al desmontar el componente.
      socket.off("newMessage"); // Elimina el listener del evento "newMessage".
    };
  }, [socket, isConnected]); // Dependencias del efecto.

  useEffect(() => { // Efecto para obtener parámetros de la URL.
    const params = new URLSearchParams(window.location.search); // Crea un objeto URLSearchParams para analizar la URL.
    const UsuarioAvatar = params.get("avatar"); // Obtiene el avatar del usuario de la URL.
    const UsuarioId = params.get("idUsuario"); // Obtiene el ID del usuario de la URL.
    if (UsuarioAvatar !== userAvatar && UsuarioId !== userId) { // Si el avatar o ID han cambiado,
      setUserAvatar(UsuarioAvatar); // Actualiza el estado del avatar del usuario.
      setUserId(UsuarioId); // Actualiza el estado del ID del usuario.
    }
  }, [userAvatar, userId]); // Dependencias del efecto.

  useEffect(() => { // Efecto para obtener contactos del servidor.
    if (!hasFetchedContacts) { // Si no se han obtenido contactos,
      const traerContactos = async () => { // Define una función asincrónica para traer contactos.
        try {
          const response = await fetch('http://localhost:4000/obtenerUsers'); // Realiza una petición para obtener usuarios.
          if (!response.ok) throw new Error('Error en la respuesta de la API'); // Lanza un error si la respuesta no es OK.
          const result = await response.json(); // Convierte la respuesta a formato JSON.
          setContacts(result); // Actualiza el estado de contactos con el resultado.
          setHasFetchedContacts(true); // Marca que se han obtenido los contactos.
        } catch (error) {
          console.error('Error al obtener contactos:', error); // Muestra un error en la consola si ocurre un problema.
        }
      };
      traerContactos(); // Llama a la función para obtener contactos.
    }
  }, [hasFetchedContacts]); // Dependencias del efecto.

  useEffect(() => { // Efecto para obtener usuarios de chat del servidor.
    if (!hasFetchedChatUsers) { // Si no se han obtenido usuarios de chat,
      const traerChatsUsers = async () => { // Define una función asincrónica para traer usuarios de chat.
        try {
          const data = { // Crea un objeto con el ID del usuario.
            id_usuario: userId
          };
          const response = await fetch('http://localhost:4000/Chat_Users', { // Realiza una petición para obtener usuarios de chat.
            method: "POST", // Define el método HTTP como POST.
            headers: { // Define los encabezados de la petición.
              "Content-Type": "application/json", // Especifica que el contenido es JSON.
            },
            body: JSON.stringify(data), // Convierte el objeto data a una cadena JSON.
          });
          if (!response.ok) throw new Error('Error en la respuesta de la API'); // Lanza un error si la respuesta no es OK.
          const result = await response.json(); // Convierte la respuesta a formato JSON.
          setChatUsers(result); // Actualiza el estado de usuarios de chat con el resultado.
          setHasFetchedChatUsers(true); // Marca que se han obtenido los usuarios de chat.
        } catch (error) {
          console.error('Error al obtener contactos:', error); // Muestra un error en la consola si ocurre un problema.
        }
      };
      traerChatsUsers(); // Llama a la función para obtener usuarios de chat.
    }
  }, [hasFetchedChatUsers, userId]); // Dependencias del efecto.

  useEffect(() => { // Efecto para obtener códigos de conexión de chats.
    if (!hasFetchedChats) { // Si no se han obtenido códigos de conexión,
      const traerCodigoChats = async () => { // Define una función asincrónica para traer códigos de conexión.
        try {
          const data = { // Crea un objeto con el ID del usuario.
            id_usuario: userId
          };
          const response = await fetch('http://localhost:4000/codigoConexion', { // Realiza una petición para obtener códigos de conexión.
            method: "POST", // Define el método HTTP como POST.
            headers: { // Define los encabezados de la petición.
              "Content-Type": "application/json", // Especifica que el contenido es JSON.
            },
            body: JSON.stringify(data), // Convierte el objeto data a una cadena JSON.
          });
          if (!response.ok) throw new Error('Error en la respuesta de la API'); // Lanza un error si la respuesta no es OK.
          const result = await response.json(); // Convierte la respuesta a formato JSON.
          setCodigosConexion(result); // Actualiza el estado de códigos de conexión con el resultado.
          setHasFetchedChats(true); // Marca que se han obtenido los códigos de conexión.
        } catch (error) {
          console.error('Error al obtener contactos:', error); // Muestra un error en la consola si ocurre un problema.
        }
      };
      traerCodigoChats(); // Llama a la función para obtener códigos de conexión.
    }
  }, [hasFetchedChats, userId]); // Dependencias del efecto.

  useEffect(() => { // Efecto para filtrar contactos que tienen chats.
    if (contacts.length > 0 && chatUsers.length > 0) { // Si hay contactos y usuarios de chat,
      const filteredContacts = contacts.filter(contact => // Filtra los contactos para encontrar coincidencias con los usuarios de chat.
        chatUsers.some(chatUser => chatUser.id_users === contact.id)
      );
      setContactsFiltrado(filteredContacts); // Actualiza el estado de contactos filtrados con el resultado.
    }
  }, [contacts, chatUsers]); // Dependencias del efecto.

  useEffect(() => { // Efecto para establecer conexiones entre usuarios de chat y códigos de conexión.
    if (chatUsers.length > 0 && codigosConexion.length > 0) { // Si hay usuarios de chat y códigos de conexión,
      const conexion = []; // Inicializa un array para almacenar las conexiones.
      for (let index = 0; index < chatUsers.length; index++) { // Itera sobre los usuarios de chat.
        for (let index2 = 0; index2 < codigosConexion.length; index2++) { // Itera sobre los códigos de conexión.
          if (chatUsers[index].id_chat === codigosConexion[index2].id) { // Si hay coincidencia en los IDs de chat,
            conexion.push({ // Agrega la conexión al array de conexiones.
              id_usuario: chatUsers[index].id_users, // Almacena el ID del usuario de chat.
              codigo_conexion: codigosConexion[index2].c_conexion // Almacena el código de conexión.
            });
          }
        }
      }
      setConexionnContacto(conexion); // Actualiza el estado de conexiones de contactos con el resultado.
    }
  }, [codigosConexion, chatUsers]); // Dependencias del efecto.

  useEffect(() => { // Efecto adicional para manejar eventos de socket.
    if (!socket) return; // Si no hay socket, no hace nada.

    socket.on("pingAll", (data) => { // Escucha el evento "pingAll".
      // Aquí puedes manejar la lógica para el evento "pingAll".
    });

    socket.on("newMessage", (data) => { // Escucha el evento "newMessage".
      // Aquí puedes manejar la lógica para el evento "newMessage".
    });
  }, [socket, isConnected]); // Dependencias del efecto.

  function conectarSala(codigo) { // Función para conectar a una sala de chat.
    if (isConnected) { // Si está conectado al socket,
      socket.emit('joinRoom', { room: codigo }); // Envía un evento para unirse a la sala.
      cargarMensajes(); // Llama a la función para cargar mensajes.
    }
  }

  const cargarMensajes = async () => { // Función asincrónica para cargar mensajes del servidor.
    try {
      const response = await fetch(`http://localhost:4000/obtenerMensajes`); // Realiza una petición para obtener mensajes.
      if (!response.ok) throw new Error('Error al cargar mensajes'); // Lanza un error si la respuesta no es OK.
      const result = await response.json(); // Convierte la respuesta a formato JSON.
      setMessages(result); // Actualiza el estado de mensajes con el resultado.
      console.log("entre", result); // Mensaje de depuración en la consola.
    } catch (error) {
      console.error('Error al cargar mensajes:', error); // Muestra un error en la consola si ocurre un problema.
    }
  };

  const handleSendMessage = async () => { // Función para manejar el envío de mensajes.
    if (inputValue.trim() !== '' && currentChat) { // Si el input no está vacío y hay un chat seleccionado,
      const newMessage = { // Crea un nuevo objeto de mensaje.
        text: inputValue, // Almacena el texto del mensaje.
        sender: 'user', // Define el remitente como 'user'.
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Almacena la hora del mensaje.
        seen: false, // Marca el mensaje como no leído.
        contactId: currentChat.id // Almacena el ID del contacto.
      };
      socket.emit('sendMessage', { mensaje: inputValue, userId: userId, userRecibe: currentChat.id }); // Envía el mensaje a través del socket.
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Obtiene la hora actual.
      await guardarMensaje(inputValue, currentChat.id, time); // Llama a la función para guardar el mensaje en la base de datos.

      setInputValue(''); // Limpia el input.
    }
  };

  const leerChat = () => { // Función para marcar el chat como leído.
    socket.emit("visto", { mensaje: "lo vi" }); // Envía un evento "visto" a través del socket.
  }

  const guardarMensaje = async (mensaje, userRecibe, time) => { // Función asincrónica para guardar un mensaje en la base de datos.
    try {
      const data = { // Crea un objeto con los datos del mensaje.
        userId: userId, // Almacena el ID del usuario.
        mensaje: mensaje, // Almacena el mensaje.
        userRecibe: userRecibe, // Almacena el ID del usuario receptor.
        time: time // Almacena la hora del mensaje.
      };
      const response = await fetch('http://localhost:4000/insertarMensaje', { // Realiza una petición para insertar el mensaje en la base de datos.
        method: "POST", // Define el método HTTP como POST.
        headers: { // Define los encabezados de la petición.
          "Content-Type": "application/json", // Especifica que el contenido es JSON.
        },
        body: JSON.stringify(data), // Convierte el objeto data a una cadena JSON.
      });
      if (!response.ok) throw new Error('Error al guardar el mensaje'); // Lanza un error si la respuesta no es OK.
      const result = await response.json(); // Convierte la respuesta a formato JSON.
    } catch (error) {
      console.error('Error al guardar el mensaje:', error); // Muestra un error en la consola si ocurre un problema.
    }
    await cargarMensajes(); // Llama a la función para cargar mensajes nuevamente.
  };

  const handleKeyPress = (e) => { // Función para manejar el evento de presionar una tecla.
    if (e.key === 'Enter') { // Si se presiona la tecla 'Enter',
      handleSendMessage(); // Llama a la función para enviar el mensaje.
    }
  };

  const handleChangeChat = (contact) => { // Función para manejar el cambio de chat.
    let conectado = false; // Inicializa una variable para verificar si hay conexión.
    for (let index = 0; index < ConexionContacto.length; index++) { // Itera sobre las conexiones de contactos.
      if (contact.id === ConexionContacto[index].id_usuario) { // Si el ID del contacto coincide con la conexión,
        if (!isConnected) { // Si no está conectado,
          setMessages([]); // Limpia los mensajes.
        }
        conectarSala(ConexionContacto[index].codigo_conexion); // Llama a la función para conectar a la sala correspondiente.
        conectado = true; // Marca que hay conexión.
      }
    }

    if (conectado) { // Si hay conexión,
      setCurrentChat(contact); // Actualiza el estado del chat actual.
      setInputValue(''); // Limpia el input.
    }
  };

  const handleSearchChange = (e) => { // Función para manejar el cambio en el input de búsqueda.
    setSearchTerm(e.target.value); // Actualiza el estado del término de búsqueda.
  };

  return ( // Retorna el JSX que define la interfaz del chat.
    <div className={styles.container}> {/* Contenedor principal con estilos CSS */}
      <ContactList // Componente que muestra la lista de contactos.
        contacts={contactsFiltrado} // Pasa los contactos filtrados.
        searchTerm={searchTerm} // Pasa el término de búsqueda.
        handleSearchChange={handleSearchChange} // Pasa la función para manejar el cambio en la búsqueda.
        handleChangeChat={handleChangeChat} // Pasa la función para manejar el cambio de chat.
        avatarUsuario={userAvatar} // Pasa el avatar del usuario.
      />
      <Chat // Componente que muestra el chat seleccionado.
        currentChat={currentChat} // Pasa el chat actual.
        messages={messages} // Pasa los mensajes.
        idUser={userId} // Pasa el ID del usuario.
        inputValue={inputValue} // Pasa el valor del input.
        setInputValue={setInputValue} // Pasa la función para actualizar el valor del input.
        handleSendMessage={handleSendMessage} // Pasa la función para enviar mensajes.
        handleKeyPress={handleKeyPress} // Pasa la función para manejar la tecla 'Enter'.
        leer={leerChat} // Pasa la función para marcar el chat como leído.
      />
    </div>
  );
};

export default ChatInterface; // Exporta el componente para que pueda ser utilizado en otras partes de la aplicación.
