// components/ContactList.js
import React from 'react';
import styles from '../app/page.module.css';

const ContactList = ({ contacts, searchTerm, handleSearchChange, handleChangeChat }) => {
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.sidebar}>
      <div className={styles.perfil}>
        <img src="imagenes/superman.jpg" className={styles.avatar}></img>
        <button><img src="imagenes/3puntitos.png" className={styles.enviar} /></button>
      </div>
      <div className={styles.buscarContacto}>
        <button><img src="imagenes/lupa.png" className={styles.enviar} /></button>
        <input
          type="text"
          placeholder="Busca el contacto..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      {filteredContacts.map(contact => (
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
  );
};

export default ContactList;
