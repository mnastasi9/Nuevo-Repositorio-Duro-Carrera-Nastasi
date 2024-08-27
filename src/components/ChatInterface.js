// components/ChatInterface.js
import { useState } from 'react';
import styles from './ChatInterface.module.css';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);  // Estado para almacenar los mensajes
  const [inputValue, setInputValue] = useState('');  // Estado para almacenar el valor del input

  // Función para manejar el envío de mensajes
  const handleSendMessage = () => {
    if (inputValue.trim() !== '') {  // Comprobar que el mensaje no esté vacío
      const newMessage = {
        text: inputValue,
        sender: 'user',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Obtener la hora actual en formato hh:mm
        seen: false, // Inicialmente, el mensaje no ha sido "visto"
      };
      setMessages([...messages, newMessage]); // Añadir el nuevo mensaje al estado
      setInputValue(''); // Limpiar el input después de enviar
    }
  };

  // Función para manejar la pulsación de la tecla "Enter"
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const markMessagesAsSeen = () => {
    setMessages(prevMessages =>
      prevMessages.map(message => ({
        ...message,
        seen: true // Marcar todos los mensajes como "vistos"
      }))
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.contact}>
          <img src="imagenes/rayo.jpeg" alt="Rayo" className={styles.avatar} />
          <div className={styles.contactInfo}>
            <p className={styles.contactName}>Rayo McQueen</p>
            <p className={styles.contactMessage}>Kuchau</p>
          </div>
        <div className={styles.contact}>
            <img src="imagenes/cenicienta.jpg" alt="Cenicienta" className={styles.avatar} />
            <div className={styles.contactInfo}>
              <p className={styles.contactName}>Cenicienta</p>
              <p className={styles.contactMessage}>aaaaa</p>
            </div>
        </div>
      </div>
       
      </div>

      <div className={styles.chatWindow}>
        <div className={styles.chatHeader}>
          <img src="imagenes/rayo.jpeg" alt="Rayo" className={styles.avatar} />
          <h2>Rayo</h2>
        </div>
        <div className={styles.chatBody}>
          {messages.map((message, index) => (
            <div key={index} className={message.sender === 'user' ? styles.sentMessageContainer : styles.receivedMessageContainer}>
              <p className={message.sender === 'user' ? styles.sentMessage : styles.receivedMessage}>
                {message.text}
              </p>
              <span className={styles.messageInfo}>
                {message.time}
                {message.sender === 'user' && (
                  <span className={styles.seenStatus}>
                    {message.seen ? '✔✔' : '✔'}
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
        <div className={styles.chatFooter}>
          <input
            type="text"
            placeholder="Escribe un mensaje..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}  // Manejar el evento de la tecla Enter
          />
          <button onClick={handleSendMessage}><img src="imagenes/enviar.png" className={styles.enviar}/></button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;