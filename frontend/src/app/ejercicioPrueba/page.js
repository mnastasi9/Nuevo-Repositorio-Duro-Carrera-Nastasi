"use client"; // Indica que este componente se ejecuta del lado del cliente
import Usuario from "@/components/Usuarios"; // Importa el componente Usuario
import styles from "./page.module.css"; // Importa los estilos CSS del módulo
import { useEffect, useState } from 'react'; // Importa hooks de React

export default function Ejercicio() {
    const [users, setUsers] = useState([]); // Estado para los usuarios
    const [hasFetchedUsers, setHasFetchedUsers] = useState(false); // Estado para controlar la carga de usuarios

    useEffect(() => {
        if (!hasFetchedUsers) { // Solo carga si no se han cargado los usuarios
            const cargarUsers = async () => {
                try {
                    const response = await fetch('http://localhost:4000/obtenerUsers', {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    if (!response.ok) throw new Error('Error en la respuesta de la API'); // Manejo de errores
                    const result = await response.json(); // Convierte la respuesta a JSON
                    setUsers(result); // Actualiza el estado de los usuarios
                    setHasFetchedUsers(true); // Indica que se han cargado los usuarios
                } catch (error) {
                    console.error('Error al obtener users:', error); // Manejo de errores en la consola
                }
            };
            cargarUsers(); // Llama a la función para cargar usuarios
        }
    }, [hasFetchedUsers]); // Dependencias de useEffect

    return (
        <div className={styles.todo}> {/* Contenedor principal */}
            <h1>Deportistas</h1>
            {users.length > 0 ? ( // Renderizado condicional
                users.map(user => (
                    <Usuario 
                        key={user.id} 
                        nombre={user.nombre} 
                        avatar={user.avatar}
                    />
                ))
            ) : (
                <p>Cargando usuarios...</p> // Mensaje de carga
            )}
        </div>
    );
}
