"use client"
import React from 'react';
import styles from '../app/page.module.css';

const OwnMessage = ({ message }) => {
  const mensaje = message.mensaje;
  return (
    <div className={styles.sentMessageContainer}>
      <p className={styles.sentMessage}>
        {mensaje}
      </p>
      <span className={styles.messageInfo}>
        {message.time || 'Sin hora'}
        {message.seen ? '✔✔' : '✔'}
      </span>
    </div>
  );
};

export default OwnMessage;

