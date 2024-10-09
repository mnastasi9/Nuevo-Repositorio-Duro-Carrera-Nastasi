"use client"; // Indica que este archivo debe ejecutarse en el lado del cliente (browser).
import React from 'react'; // Importa React.
import styles from '../app/page.module.css'; // Importa los estilos CSS del archivo page.module.css.
import { useEffect } from 'react'; // Importa useEffect para manejar efectos secundarios.

const ContactMessage = ({ message, leer, idUser, currentChat }) => {
  const mensaje = message.mensaje; // Obtiene el mensaje de las props.

  useEffect(() => {
    // Función para marcar el mensaje como leído en la base de datos.
    async function leerMensajes(userId, userRecibe) {
      const data = {
        userId: userRecibe, // El ID del usuario que recibe el mensaje.
        userRecibe: userId // El ID del usuario que envía el mensaje.
      };

      // Realiza una solicitud PUT para modificar el estado del mensaje en la base de datos.
      const response = await fetch('http://localhost:4000/modificarSeen', {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // Especifica que el cuerpo es JSON.
        },
        body: JSON.stringify(data), // Convierte el objeto data en una cadena JSON.
      });
      const result = await response.json(); // Convierte la respuesta en JSON.
      console.log(result); // Imprime el resultado en la consola.

      // Si la respuesta es exitosa, llama a la función leer.
      if (result) {
        leer();
      }
    }

    // Si hay un chat actual y el ID del usuario está disponible, llama a la función leerMensajes.
    if (currentChat?.id && idUser) {
      leerMensajes(idUser, currentChat?.id);
    }
  }, [idUser, currentChat]); // Dependencias del useEffect: se ejecuta cuando idUser o currentChat cambian.

  return (
    <div className={styles.receivedMessageContainer}> {/* Contenedor del mensaje recibido */}
      <p className={styles.receivedMessage}> {/* Muestra el mensaje */}
        {mensaje}
      </p>
      <span className={styles.messageInfo}> {/* Muestra la información del mensaje (hora) */}
        {message.time}
      </span>
    </div>
  );
};

export default ContactMessage; // Exporta el componente ContactMessage para ser utilizado en otras partes de la aplicación.
