// components/OwnMessage.js
import React from 'react';
import styles from '../app/page.module.css';

const OwnMessage = ({ message }) => {
  console.log("mensaje recibido del own", message)
  return (
    <div className={styles.sentMessageContainer}>
      <p className={styles.sentMessage}>
        {message.text}
      </p>
      <span className={styles.messageInfo}>
        {message.time}
        {message.seen ? '✔✔' : '✔'}
      </span>
    </div>
  );
};

export default OwnMessage;
