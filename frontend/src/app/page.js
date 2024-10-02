"use client"; 
import { useEffect, useState } from 'react';
import ContactList from '../components/ContactList';
import Chat from '../components/Chat';
import styles from './page.module.css';
import { useSocket } from "@/hooks/useSocket";

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [currentChat, setCurrentChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userAvatar, setUserAvatar] = useState(null);
  const [userId, setUserId] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [contactsFiltrado, setContactsFiltrado] = useState([]);
  const [chatUsers, setChatUsers] = useState([]);
  const [hasFetchedContacts, setHasFetchedContacts] = useState(false);
  const [hasFetchedChatUsers, setHasFetchedChatUsers] = useState(false);
  const [hasFetchedChats, setHasFetchedChats] = useState(false);
  const [codigosConexion, setCodigosConexion] = useState([]);
  const [ConexionContacto, setConexionnContacto] = useState([]);
  const { socket, isConnected } = useSocket();
  const {loVi, setLoVi} = useState(false)

  useEffect( () => {
    if (!socket) return;

    socket.on("newMessage", (mensaje) => {
      guardarMensaje(mensaje, userId);
      setLoVi(true)
    });

    console.log("cambioSocket")
    socket.on("nuevoVisto", (mensaje) => {
      console.log("lo vi marche")
      cargarMensajes();
    });

    return () => {
      socket.off("newMessage");
    };
  }, [socket, isConnected]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const UsuarioAvatar = params.get("avatar");
    const UsuarioId = params.get("idUsuario");
    if (UsuarioAvatar !== userAvatar && UsuarioId !== userId) {
      setUserAvatar(UsuarioAvatar);
      setUserId(UsuarioId);
    }
  }, [userAvatar, userId]);

  useEffect(() => {
    if (!hasFetchedContacts) {
      const traerContactos = async () => {
        try {
          const response = await fetch('http://localhost:4000/obtenerUsers');
          if (!response.ok) throw new Error('Error en la respuesta de la API');
          const result = await response.json();
          setContacts(result);
          setHasFetchedContacts(true);
        } catch (error) {
          console.error('Error al obtener contactos:', error);
        }
      };
      traerContactos();
    }
  }, [hasFetchedContacts]);

  useEffect(() => {
    if (!hasFetchedChatUsers) {
      const traerChatsUsers = async () => {
        try {
          const data = {
            id_usuario: userId
          };
          const response = await fetch('http://localhost:4000/Chat_Users', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
          if (!response.ok) throw new Error('Error en la respuesta de la API');
          const result = await response.json();
          setChatUsers(result);
          setHasFetchedChatUsers(true);
        } catch (error) {
          console.error('Error al obtener contactos:', error);
        }
      };
      traerChatsUsers();
    }
  }, [hasFetchedChatUsers, userId]);

  useEffect(() => {
    if (!hasFetchedChats) {
      const traerCodigoChats = async () => {
        try {
          const data = {
            id_usuario: userId
          };
          const response = await fetch('http://localhost:4000/codigoConexion', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
          if (!response.ok) throw new Error('Error en la respuesta de la API');
          const result = await response.json();
          setCodigosConexion(result);
          setHasFetchedChats(true);
        } catch (error) {
          console.error('Error al obtener contactos:', error);
        }
      };
      traerCodigoChats();
    }
  }, [hasFetchedChats, userId]);

  useEffect(() => {
    if (contacts.length > 0 && chatUsers.length > 0) {
      const filteredContacts = contacts.filter(contact =>
        chatUsers.some(chatUser => chatUser.id_users === contact.id)
      );
      setContactsFiltrado(filteredContacts);
    }
  }, [contacts, chatUsers]);

  useEffect(() => {
    if (chatUsers.length > 0 && codigosConexion.length > 0) {
      const conexion = [];
      for (let index = 0; index < chatUsers.length; index++) {
        for (let index2 = 0; index2 < codigosConexion.length; index2++) {
          if (chatUsers[index].id_chat === codigosConexion[index2].id) {
            conexion.push({ id_usuario: chatUsers[index].id_users, codigo_conexion: codigosConexion[index2].c_conexion });
          }
        }
      }
      setConexionnContacto(conexion);
    }
  }, [codigosConexion, chatUsers]);

  useEffect(() => {
    if (!socket) return;

    socket.on("pingAll", (data) => {
    });

    socket.on("newMessage", (data) => {
    });
  }, [socket, isConnected]);

  function conectarSala(codigo) {
    if (isConnected) {
      socket.emit('joinRoom', { room: codigo });
      cargarMensajes(); 
    }
  }

  const cargarMensajes = async () => {
    try {
      const response = await fetch(`http://localhost:4000/obtenerMensajes`);
      if (!response.ok) throw new Error('Error al cargar mensajes');
      const result = await response.json();
      setMessages(result); 
      console.log("entre", result)
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
    }
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() !== '' && currentChat) {
      const newMessage = {
        text: inputValue,
        sender: 'user',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        seen: false,
        contactId: currentChat.id
      };
      socket.emit('sendMessage', { mensaje: inputValue, userId: userId, userRecibe: currentChat.id });
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      await guardarMensaje(inputValue, currentChat.id, time);

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputValue('');
    }
  };

  const leerChat = () => {
    socket.emit("visto", {mensaje: "lo vi"})
  }

  const guardarMensaje = async (mensaje, userRecibe, time) => {
    try {
      const data = {
        userId: userId,
        mensaje: mensaje,
        userRecibe: userRecibe,
        time: time
      };
      const response = await fetch('http://localhost:4000/insertarMensaje', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Error al guardar el mensaje');
      const result = await response.json();
    } catch (error) {
      console.error('Error al guardar el mensaje:', error);
    }
    await cargarMensajes()
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleChangeChat = (contact) => {
    let conectado = false;
    for (let index = 0; index < ConexionContacto.length; index++) {
      if (contact.id === ConexionContacto[index].id_usuario) {
        if (!isConnected) {
          setMessages([]);
        }
        conectarSala(ConexionContacto[index].codigo_conexion);
        conectado = true;
      }
    }

    if (conectado) {
      setCurrentChat(contact);
      setInputValue('');
    }

  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className={styles.container}>
      <ContactList
        contacts={contactsFiltrado}
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        handleChangeChat={handleChangeChat}
        avatarUsuario={userAvatar}
      />
      <Chat
        currentChat={currentChat}
        messages={messages} 
        idUser={userId}
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSendMessage={handleSendMessage}
        handleKeyPress={handleKeyPress}
        leer={leerChat}
        vio={loVi}
      />
    </div>
  );
};

export default ChatInterface;
