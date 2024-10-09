"use client"; // Indica que este componente se ejecuta del lado del cliente
import React from 'react'; // Importa React
import styles from '../app/page.module.css'; // Importa los estilos CSS del módulo
import clsx from 'clsx'; // Importa la biblioteca clsx para manejar clases condicionales

const OwnMessage = ({ message }) => {
  const mensaje = message.mensaje; // Extrae el mensaje del objeto 'message'

  // Determina si el mensaje ha sido visto o no
  const si = message.seen === "seenVisto"; // Usar un valor booleano directamente

  return (
    <div className={styles.sentMessageContainer}>
      <p className={styles.sentMessage}>
        {mensaje}
      </p>
      <span className={styles.mensajeChat}>
        {message.time || 'Sin hora'} {/* Muestra la hora del mensaje o 'Sin hora' si no está definida */}
        <span className={clsx(
          { 
            [styles.seenVisto]: si, // Aplica la clase 'seenVisto' si el mensaje ha sido visto
            [styles.seenNoVisto]: !si // Aplica la clase 'seenNoVisto' si el mensaje no ha sido visto
          }
        )}>
          {' ✔✔'} {/* Marca que el mensaje ha sido enviado (puedes ajustar el icono según tu diseño) */}
        </span>
      </span>
    </div>
  );
};

export default OwnMessage; // Exporta el componente


