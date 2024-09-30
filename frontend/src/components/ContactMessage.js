"use client"
import React from 'react';
import styles from '../app/page.module.css';

const ContactMessage = ({ message }) => {
  const mensaje = message.mensaje;
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
