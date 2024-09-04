"use client"
// components/ChatInterface.js
import { useSocket } from '@/hooks/useSocket';
import { useEffect } from 'react';
import { useState } from 'react';
import ContactList from '../components/ContactList';
import Chat from '../components/Chat';
import styles from './page.module.css';
import Button from '@/components/button';

export default function UsersRanking(){

  //Le aclaro a la pagina o componente  que quiero usar el  hook useSocket
  const {socket, isConnected} = useSocket();
  useEffect(()=>{
    //Para evitar que genere errores si no esta el socket
    if(!socket)return;
    socket.on('pingAll', (data) => {
      console.log("Me llego el evento pingAll", data);
    })


  },[socket, isConnected]);

  function handleClick() {
    socket.emit('pingAll', {message: "feli 5cm"});
  }

  return(
    <>
      <h1>Soy la ruta /ranking/users</h1>
      <Button onClick={handleClick} text="Enviar pingAll" />
    </>
  )
}



const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [currentChat, setCurrentChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const contacts = [
    { id: 1, name: 'Rayo McQueen', avatar: 'imagenes/rayo.jpeg', lastMessage: 'Kuchau' },
    { id: 2, name: 'Cenicienta', avatar: 'imagenes/cenicienta.jpg', lastMessage: 'aaaaa' },
    { id: 3, name: 'Abi', avatar: 'imagenes/abi.jpg', lastMessage: 'pooobre looolooo' },
    { id: 4, name: 'Shrek', avatar: 'imagenes/shrek.jpg', lastMessage: 'los ogros son como las cebollas' }
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


