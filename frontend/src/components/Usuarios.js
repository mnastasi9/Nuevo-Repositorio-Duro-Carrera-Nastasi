"use client";
import styles from '../app/page.module.css';

const Usuario = ({ nombre, avatar }) => {
    return (
        <div className={styles.contact}>
            <img src={avatar} alt={nombre} className={styles.avatar} />
            <div>
                <p>{nombre}</p>
            </div>
        </div>
    );
};

export default Usuario;
