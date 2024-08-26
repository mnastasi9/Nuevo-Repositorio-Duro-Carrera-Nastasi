// components/ChatInterface.js
import styles from './ChatInterface.module.css';
import Mensaje from './mensaje';

const ChatInterface = () => {
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
      
      {/* Añadir más contactos aquí */}
    </div>

            <div className={styles.chatWindow}>
                <div className={styles.chatHeader}>
                <h2>Rayo</h2>
                </div>
                <Mensaje></Mensaje>
                <div className={styles.chatFooter}>
                <input type="text" placeholder="Escribe un mensaje..." />
                <button>Enviar</button>
                </div>
            </div>
            </div>
  );
};

export default ChatInterface;
