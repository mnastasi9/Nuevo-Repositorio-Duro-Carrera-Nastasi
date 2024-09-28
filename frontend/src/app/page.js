"use client"
// components/ChatInterface.js
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
  const [contacts, setContacts] = useState([]);
  const [hasFetchedContacts, setHasFetchedContacts] = useState(false);

  // Hook para obtener el avatar del usuario desde la URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const UsuarioAvatar = params.get("avatar");
    if (UsuarioAvatar !== userAvatar) {
      setUserAvatar(UsuarioAvatar);
    }
  }, [userAvatar]);

  // Hook para obtener la lista de contactos
  useEffect(() => {
    if (!hasFetchedContacts) {
      const crearContacts = async () => {
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
      crearContacts();
    }
  }, [hasFetchedContacts]);

  // Hook para filtrar contactos coincidentes con el avatar del usuario
  useEffect(() => {
    if (userAvatar) {
      const filteredContacts = contacts.filter(contact => contact.avatar !== userAvatar);
      if (filteredContacts.length !== contacts.length) {
        setContacts(filteredContacts);
      }
    }
  }, [userAvatar, contacts]);

  // Manejar el envío de mensajes
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

  // Manejar la pulsación de la tecla Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Cambiar de chat
  const handleChangeChat = (contact) => {
    setCurrentChat(contact);
    setInputValue('');
  };

  // Manejar cambios en la búsqueda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className={styles.container}>
      <ContactList
        contacts={contacts}
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
