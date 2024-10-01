"use client"
import React from 'react';
import styles from '../app/page.module.css';
import clsx from 'clsx';

const OwnMessage = ({ message }) => {
  const mensaje = message.mensaje;
  let si=true
  if (message.seen=="seenVisto") {
    si=true
  } else {
    si=false
  }
  return (
    <div className={styles.sentMessageContainer}>
      <p className={styles.sentMessage}>
        {mensaje}
      </p>
      <span className={styles.mensajeChat}>
        {message.time || 'Sin hora'}
        <span className={clsx(
          { 
            [styles.seenVisto]: si, 
            [styles.seenNoVisto]: si
          }
          )}>
          {' ✔✔'}
        </span>
      </span>
    </div>
  );
};

export default OwnMessage;

