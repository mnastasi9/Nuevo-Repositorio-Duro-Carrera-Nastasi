// components/Chat.js
import React from 'react';
import OwnMessage from './OwnMessage';
import ContactMessage from './ContactMessage';
import styles from '../app/page.module.css';

const Chat = ({ currentChat, messages, inputValue, setInputValue, handleSendMessage, handleKeyPress }) => {
  const filteredMessages = messages.filter(message => message.contactId === currentChat?.id);

  return (
    <div className={styles.chatWindow}>
      {currentChat ? (
        <>
          <div className={styles.chatHeader}>
            <div className={styles.divCabecera}>
              <img src={currentChat.avatar} alt={currentChat.name} className={styles.avatar} />
              <h2>{currentChat.name}</h2>
            </div>
            <button><img src="imagenes/3puntitos.png" className={styles.enviar} /></button>
          </div>

          <div className={styles.chatBody}>
            {filteredMessages.map((message, index) => (
              message.sender === 'user' ? 
                <OwnMessage key={index} message={message} /> : 
                <ContactMessage key={index} message={message} />
            ))}
          </div>

          <div className={styles.chatFooter}>
            <input
              type="text"
              placeholder="Escribe un mensaje..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button onClick={handleSendMessage}><img src="imagenes/enviar.png" className={styles.enviar} /></button>
          </div>
        </>
      ) : (
        <img src="imagenes/logo.compu.png" className={styles.inicio} />
        // <div className={styles.chatPlaceholder}>
        //   <img src="imagenes/logo.compu.png" className={styles.inicio} />
        // </div>
      )}
    </div>
  );
};

export default Chat;
