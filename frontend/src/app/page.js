"use client"
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
  const [ConexionContacto, setConexionnContacto] = useState([])
  const {socket, isConnected} = useSocket();


  useEffect(() => {
    if (!socket) return;
    console.log("Socket en useEffect:", socket);
    console.log("Estado de la conexión:", isConnected);
    socket.on("newMessage", (mensaje) =>{
      let mensajeTemp = messages;
      mensajeTemp.push(mensaje);
      setMessages(mensajeTemp);
      console.log("mensajes", messages)
   })
  }, [socket, isConnected]);
  

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const UsuarioAvatar = params.get("avatar");
    const UsuarioId = params.get("idUsuario")
    if (UsuarioAvatar !== userAvatar && UsuarioId !== userId) {
      setUserAvatar(UsuarioAvatar);
      setUserId(UsuarioId)
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
          console.log(result)
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
          console.log(result)
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
      console.log(filteredContacts);
    }
  }, [contacts, chatUsers]);

  useEffect(() => {
    if (chatUsers.length > 0 && codigosConexion.length > 0) {
      const conexion = []
      for (let index = 0; index < chatUsers.length; index++) {
        for (let index2 = 0; index2 < codigosConexion.length; index2++) {
          if (chatUsers[index].id_chat==codigosConexion[index2].id) {
            conexion.push({id_usuario: chatUsers[index].id_users, codigo_conexion: codigosConexion[index2].c_conexion})
          }
        }
      }
      setConexionnContacto(conexion)
      console.log(ConexionContacto)
    }
  }, [codigosConexion, chatUsers]);

  useEffect(() => {
    if(!socket) return;

    socket.on("pingAll", (data) =>{
        console.log("Mensaje recibido: ", data);
    })

    socket.on("newMessage", (data) =>{
        console.log("Mensaje recibido de la sala: ", data);
    })
}, [socket, isConnected]);

  function conectarSala(codigo) {
      console.log(codigo)
      console.log("Socket conectado:", isConnected);
      if(isConnected) {
          console.log("Hola")
          socket.emit('joinRoom', {room: codigo});
      }
  }


  const handleSendMessage = () => {
    console.log("Imprimo state demensaje", messages)
    if (inputValue.trim() !== '' && currentChat) {
      const newMessage = {
        text: inputValue,
        sender: 'user',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        seen: false,
        contactId: currentChat.id
      };
      console.log("current", currentChat.id)
      socket.emit('sendMessage', {mensaje: inputValue, userId: userId, userRecibe: currentChat.id})
      setMessages([...messages, newMessage]);
      console.log("mensajes en enviar", messages)
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleChangeChat = (contact) => {
    console.log("hola");
    console.log("Contacto:", contact);
    console.log("ConexionContacto:", ConexionContacto);
    
    
    let conectado = false;
    for (let index = 0; index < ConexionContacto.length; index++) {
        console.log("chau");
        if (contact.id == ConexionContacto[index].id_usuario) {
          if(!isConnected) {
            console.log("desconectar")
            setMessages([])
            socket.on(`disconnect`, "se desconecto")

          }
            conectarSala(ConexionContacto[index].codigo_conexion)
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
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSendMessage={handleSendMessage}
        handleKeyPress={handleKeyPress}
      />
    </div>
  );
};

export default ChatInterface;
