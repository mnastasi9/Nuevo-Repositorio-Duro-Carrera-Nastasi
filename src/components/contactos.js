import styles from "./button.module.css"

export default function Contactos() {

    return (
        <div className={styles.contact}>
            <img src="imagenes/cenicienta.jpg" alt="Cenicienta" className={styles.avatar} />
            <div className={styles.contactInfo}>
            <p className={styles.contactName}>Cenicienta</p>
            <p className={styles.contactMessage}>aaaaa</p>
            </div>
        </div>
    )

}