"use client"; // Indica que este archivo debe ejecutarse en el lado del cliente (browser).

import OwnMessage from './OwnMessage'; // Importa el componente OwnMessage para mostrar los mensajes del usuario.
import ContactMessage from './ContactMessage'; // Importa el componente ContactMessage para mostrar los mensajes de otros contactos.
import styles from '../app/page.module.css'; // Importa los estilos CSS del archivo page.module.css.
import { useEffect } from 'react'; // Importa useEffect de React (aunque no se usa en este fragmento).
import { useSocket } from "@/hooks/useSocket"; // Importa el hook useSocket para manejar la conexión de WebSocket.

const Chat = ({ currentChat, messages, idUser, inputValue, setInputValue, handleSendMessage, handleKeyPress, leer }) => {
  const { socket, isConnected } = useSocket(); // Obtiene el socket y el estado de conexión del hook useSocket.
  console.log(messages); // Muestra los mensajes en la consola para depuración.

  // Filtra los mensajes relevantes entre el usuario actual y el chat actual.
  const filteredMessages = messages.filter(msg => 
    (Number(msg.userId) === Number(currentChat?.id) && Number(msg.userRecibe) === Number(idUser)) || 
    (Number(msg.userRecibe) === Number(currentChat?.id) && Number(msg.userId) === Number(idUser))
  );

  return (
    <div className={styles.chatWindow}> {/* Contenedor principal del chat */}
      {currentChat ? ( // Verifica si hay un chat actual
        <>
          <div className={styles.chatHeader}> {/* Encabezado del chat */}
            <div className={styles.divCabecera}>
              <img src={currentChat.avatar} alt={currentChat.nombre} className={styles.avatar} /> {/* Muestra el avatar del contacto */}
              <p className={styles.contactName}>{currentChat.nombre}</p> {/* Muestra el nombre del contacto */}
            </div>
            <button><img src="imagenes/3puntitos.png" className={styles.enviar} /></button> {/* Botón adicional (puede tener más funciones) */}
          </div>
          
          <div className={styles.chatBody}> {/* Cuerpo del chat donde se muestran los mensajes */}
            {filteredMessages.map((msg, index) => ( // Mapea los mensajes filtrados
              Number(msg.userId) === Number(idUser) ? // Verifica si el mensaje es del usuario actual
                <OwnMessage key={index} message={msg} /> : // Renderiza el componente OwnMessage para el usuario
                <ContactMessage key={index} message={msg} leer={leer} idUser={idUser} currentChat={currentChat} /> // Renderiza el componente ContactMessage para el contacto
            ))}
          </div>

          <div className={styles.chatFooter}> {/* Pie del chat donde se ingresa el mensaje */}
            <input
              type="text"
              placeholder="Escribe un mensaje..." // Placeholder para el input
              value={inputValue} // Valor del input vinculado al estado
              onChange={(e) => setInputValue(e.target.value)} // Actualiza el estado al cambiar el valor del input
              onKeyDown={handleKeyPress} // Maneja el evento de presionar una tecla (para enviar el mensaje con "Enter")
            />
            <button onClick={handleSendMessage}> {/* Botón para enviar el mensaje */}
              <img src="imagenes/enviar.png" className={styles.enviar} /> {/* Icono para el botón de enviar */}
            </button>
          </div>
        </>
      ) : (
        <img src="imagenes/logo.compu.png" className={styles.inicio} /> // Muestra un logo si no hay chat actual
      )}
    </div>
  );
};

export default Chat; // Exporta el componente Chat para ser utilizado en otras partes de la aplicación.
