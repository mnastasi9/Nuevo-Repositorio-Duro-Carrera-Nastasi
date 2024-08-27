import styles from './ChatInterface.module.css';
 
export default function Mensaje() {
    return (
        <div className={styles.chatBody}>
            <p className={styles.sentMessage}>hola</p>
            <p className={styles.receivedMessage}>hola</p>
        </div>
    )
}

