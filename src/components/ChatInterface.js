// components/ChatInterface.js
import { useState } from 'react';
import styles from './ChatInterface.module.css';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);  // Estado para almacenar todos los mensajes
  const [inputValue, setInputValue] = useState('');  // Estado para almacenar el valor del input
  const [currentChat, setCurrentChat] = useState(null); // Estado para el contacto actual seleccionado
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda

  // Lista de contactos
  const contacts = [
    { id: 1, name: 'Rayo McQueen', avatar: 'imagenes/rayo.jpeg', lastMessage: 'Kuchau' },
    { id: 2, name: 'Cenicienta', avatar: 'imagenes/cenicienta.jpg', lastMessage: 'aaaaa' },
    { id: 3, name: 'Abi', avatar: 'imagenes/abi.jpg', lastMessage: 'pooobre looolooo'}
  ];

  // Función para manejar el envío de mensajes
  const handleSendMessage = () => {
    if (inputValue.trim() !== '' && currentChat) {  // Comprobar que el mensaje no esté vacío y que haya un chat seleccionado
      const newMessage = {
        text: inputValue,
        sender: 'user',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Obtener la hora actual en formato hh:mm
        seen: false, // Inicialmente, el mensaje no ha sido "visto"
        contactId: currentChat.id // Asociar el mensaje con el contacto actual
      };
      setMessages([...messages, newMessage]); // Añadir el nuevo mensaje al estado
      setInputValue(''); // Limpiar el input después de enviar
    }
  };

  // Función para manejar la pulsación de la tecla "Enter"
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Función para cambiar el chat actual
  const handleChangeChat = (contact) => {
    setCurrentChat(contact); // Establecer el contacto actual seleccionado
    setInputValue('');
  };

  // Función para manejar la búsqueda de contactos
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Actualizar el término de búsqueda en el estado
  };

  // Filtrar los contactos según el término de búsqueda
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtrar los mensajes que pertenecen al contacto actual seleccionado
  const filteredMessages = messages.filter(message => message.contactId === currentChat?.id);

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.buscarContacto}>
          <button><img src="imagenes/lupa.png" className={styles.enviar} /></button>
          <input
            type="text"
            placeholder="Busca el contacto..."
            value={searchTerm}
            onChange={handleSearchChange}  // Manejar el cambio en el input de búsqueda
          />
          <button><img src="imagenes/3puntitos.png" className={styles.enviar} /></button>
        </div>
        {filteredContacts.map(contact => (  // Usar contactos filtrados aquí
          <button key={contact.id} onClick={() => handleChangeChat(contact)} className={styles.button}>
            <div className={styles.contact}>
              <img src={contact.avatar} alt={contact.name} className={styles.avatar} />
              <div className={styles.contactInfo}>
                <p className={styles.contactName}>{contact.name}</p>
                <p className={styles.contactMessage}>{contact.lastMessage}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className={styles.chatWindow}>
        {currentChat ? (
          <>
            <div className={styles.chatHeader}>
              <div className={styles.divCabecera}>
                <img src={currentChat.avatar} alt={currentChat.name} className={styles.avatar} />
                <h2>{currentChat.name}</h2>
              </div>
              <button><img src="imagenes/3puntitos.png" className={styles.enviar} /></button>
            </div>

            <div className={styles.chatBody}>
              {filteredMessages.map((message, index) => (
                <div key={index} className={message.sender === 'user' ? styles.sentMessageContainer : styles.receivedMessageContainer}>
                  <p className={message.sender === 'user' ? styles.sentMessage : styles.receivedMessage}>
                    {message.text}
                  </p>
                  <span className={styles.messageInfo}>
                    {message.time}
                    {message.sender === 'user' && (
                      <span className={styles.seenStatus}>
                        {message.seen ? '✔✔' : '✔'}
                      </span>
                    )}
                  </span>
                </div>

              ))}
            </div>
            <div className={styles.chatFooter}>
              <input
                type="text"
                placeholder="Escribe un mensaje..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}  // Manejar el evento de la tecla Enter
              />
              <button onClick={handleSendMessage}><img src="imagenes/enviar.png" className={styles.enviar} /></button>
            </div>
          </>
        ) : (
          <div className={styles.chatPlaceholder}>
            <h2>Seleccione un contacto para empezar a chatear.</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
