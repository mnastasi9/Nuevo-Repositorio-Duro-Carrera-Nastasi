"use client"
import { useEffect, useState } from 'react';
import ContactList from '../components/ContactList';
import Chat from '../components/Chat';
import styles from './page.module.css';

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
          const response = await fetch('http://localhost:3000/obtenerUsers');
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
          const response = await fetch('http://localhost:3000/Chat_Users', {
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
          const response = await fetch('http://localhost:3000/codigoConexion', {
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

  const handleSendMessage = () => {
    if (inputValue.trim() !== '' && currentChat) {
      const newMessage = {
        text: inputValue,
        sender: 'user',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        seen: false,
        contactId: currentChat.id
      };
      setMessages([...messages, newMessage]);
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
            console.log("conectado");
            // socket.emit('joinRoom', {room: [ConexionContacto[index].codigo_conexion]})
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
