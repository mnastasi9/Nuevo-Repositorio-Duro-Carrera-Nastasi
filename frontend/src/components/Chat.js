"use client"
import OwnMessage from './OwnMessage';
import ContactMessage from './ContactMessage';
import styles from '../app/page.module.css';
import { useEffect} from 'react';
import { useSocket } from "@/hooks/useSocket";


const Chat = ({ currentChat, messages, idUser, inputValue, setInputValue, handleSendMessage, handleKeyPress, leer, vio }) => {
  const { socket, isConnected } = useSocket();
  console.log(messages)
  const filteredMessages = messages.filter(msg => 
    (Number(msg.userId) === Number(currentChat?.id) && Number(msg.userRecibe) === Number(idUser)) || 
    (Number(msg.userRecibe) === Number(currentChat?.id) && Number(msg.userId) === Number(idUser))
  );

  useEffect(() => {
  
    async function leerMensajes(userId, userRecibe) {
      const data = {
         userId : userRecibe,
         userRecibe: userId
      }
  
      const response = await fetch('http://localhost:4000/modificarSeen',{
          method:"PUT",
          headers: {
              "Content-Type": "application/json",
            },
          body:JSON.stringify(data),
  
      })
      const result = await response.json();
      console.log(result)
      if(result) {
        leer()
        vio=false
      }
  }
  
    // Solo llamar a la función si currentChat y idUser están definidos
    if (currentChat?.id && idUser) {
      leerMensajes(idUser, currentChat?.id);
    }
  }, [idUser, currentChat]);
  
  if(vio) {
    console.log("hola")
    leer()
  }
  

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
            {filteredMessages.map((msg, index) => (
              Number(msg.userId) === Number(idUser) ? 
                <OwnMessage key={index} message={msg} /> : 
                <ContactMessage key={index} message={msg} />
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
      )}
    </div>
  );
};

export default Chat;
