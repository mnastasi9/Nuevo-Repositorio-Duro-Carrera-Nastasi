"use client"
// components/ChatInterface.js
import { useState } from 'react';
import ContactList from '../components/ContactList';
import Chat from '../components/Chat';
import styles from './page.module.css';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [currentChat, setCurrentChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const contacts = [
    { id: 1, name: 'Rayo McQueen', avatar: 'imagenes/rayo.jpeg', lastMessage: 'Kuchau' },
    { id: 2, name: 'Cenicienta', avatar: 'imagenes/cenicienta.jpg', lastMessage: 'aaaaa' },
    { id: 3, name: 'Abi', avatar: 'imagenes/abi.jpg', lastMessage: 'pooobre looolooo' }
  ];

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
    setCurrentChat(contact);
    setInputValue('');
  };

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
