"use client"; // Indica que este archivo debe ejecutarse en el lado del cliente (browser).
import React, { useEffect } from 'react'; // Importa React y useEffect.
import styles from '../app/page.module.css'; // Importa los estilos CSS del archivo page.module.css.

const ContactList = ({ contacts, searchTerm, handleSearchChange, handleChangeChat, avatarUsuario }) => {
  // Filtra los contactos según el término de búsqueda, ignorando mayúsculas y minúsculas.
  const filteredContacts = contacts.filter(contact =>
    contact.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.sidebar}> {/* Contenedor principal de la lista de contactos */}
      <div className={styles.perfil}> {/* Sección de perfil del usuario */}
        <img src={avatarUsuario} className={styles.avatar} id="imagenAvatar" alt="Avatar del usuario"/> {/* Muestra el avatar del usuario */}
        <button><img src="imagenes/3puntitos.png" className={styles.enviar} alt="Opciones"/></button> {/* Botón para opciones adicionales */}
      </div>
      <div className={styles.buscarContacto}> {/* Sección de búsqueda de contactos */}
        <button><img src="imagenes/lupa.png" className={styles.enviar} alt="Buscar"/></button> {/* Botón de búsqueda */}
        <input
          type="text"
          placeholder="Busca el contacto..." // Placeholder para el campo de búsqueda
          value={searchTerm} // Valor del input vinculado al estado de búsqueda
          onChange={handleSearchChange} // Maneja el cambio en el input de búsqueda
        />
      </div>
      {filteredContacts.map(contact => ( // Mapea los contactos filtrados y los renderiza
        <button key={contact.id} onClick={() => handleChangeChat(contact)} className={styles.button}> {/* Botón para seleccionar un contacto */}
          <div className={styles.contact}> {/* Contenedor de información del contacto */}
            <img src={contact.avatar} alt={contact.nombre} className={styles.avatar} /> {/* Muestra el avatar del contacto */}
            <div className={styles.contactInfo}> {/* Contenedor de información adicional del contacto */}
              <p className={styles.contactName}>{contact.nombre}</p> {/* Muestra el nombre del contacto */}
              <p className={styles.contactMessage}>{contact.descripcion}</p> {/* Muestra una descripción del contacto */}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ContactList; // Exporta el componente ContactList para ser utilizado en otras partes de la aplicación.
