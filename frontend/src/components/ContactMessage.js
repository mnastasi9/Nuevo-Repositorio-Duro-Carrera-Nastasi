// components/ContactMessage.js
import React from 'react';
import styles from '../app/page.module.css';

const ContactMessage = ({ message }) => {
  return (
    <div className={styles.receivedMessageContainer}>
      <p className={styles.receivedMessage}>
        {message.text}
      </p>
      <span className={styles.messageInfo}>
        {message.time}
      </span>
    </div>
  );
};

export default ContactMessage;
