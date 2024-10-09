"use client"; // Indica que este componente se ejecuta del lado del cliente
import styles from '../app/page.module.css'; // Importa los estilos CSS del módulo

const Usuario = ({ nombre, avatar }) => {
    return (
        <div className={styles.contact}> {/* Contenedor principal del contacto */}
            <img src={avatar} alt={nombre} className={styles.avatar} /> {/* Avatar del usuario */}
            <div>
                <p>{nombre}</p> {/* Nombre del usuario */}
            </div>
        </div>
    );
};

export default Usuario; // Exporta el componente

