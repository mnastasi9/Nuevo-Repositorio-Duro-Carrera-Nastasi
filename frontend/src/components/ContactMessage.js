"use client"
import React from 'react';
import styles from '../app/page.module.css';
import { useEffect} from 'react';

const ContactMessage = ({ message, leer, idUser, currentChat }) => {
  const mensaje = message.mensaje;
  
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
      }
  }
  
 
    if (currentChat?.id && idUser) {
      leerMensajes(idUser, currentChat?.id);
    }
  }, [idUser, currentChat]);

  return (
    <div className={styles.receivedMessageContainer}>
      <p className={styles.receivedMessage}>
        {mensaje}
      </p>
      <span className={styles.messageInfo}>
        {message.time}
      </span>
    </div>
  );
};

export default ContactMessage;
