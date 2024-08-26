// components/ChatInterface.js
import styles from './ChatInterface.module.css';

const ChatInterface = () => {
  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.contact}>
          <img src="/user1.png" alt="Zoila NH" className={styles.avatar} />
          <div className={styles.contactInfo}>
            <p className={styles.contactName}>Zoila NH</p>
            <p className={styles.contactMessage}>Bien, Gracias</p>
          </div>
        </div>
        {/* Añadir más contactos aquí */}
      </div>

            <div className={styles.chatWindow}>
                <div className={styles.chatHeader}>
                <h2>Zoila NH</h2>
                </div>
                <div className={styles.chatBody}>
                <p className={styles.sentMessage}>hola</p>
                <p className={styles.receivedMessage}>Hola</p>
                {/* Añadir más mensajes aquí */}
                </div>
                <div className={styles.chatFooter}>
                <input type="text" placeholder="Escribe un mensaje..." />
                <button>Enviar</button>
                </div>
            </div>
            </div>
  );
};

export default ChatInterface;
