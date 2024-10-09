"use client";
import Usuario from "@/components/Usuarios";
import styles from "./page.module.css";
import { useEffect, useState } from 'react';

export default function Ejercicio() {
    const [users, setUsers] = useState([]);
    const [hasFetchedUsers, setHasFetchedUsers] = useState(false);

    useEffect(() => {
        if (!hasFetchedUsers) {
            const cargarUsers = async () => {
                try {
                    const response = await fetch('http://localhost:4000/obtenerUsers', {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    if (!response.ok) throw new Error('Error en la respuesta de la API');
                    const result = await response.json();
                    setUsers(result);
                    setHasFetchedUsers(true);
                } catch (error) {
                    console.error('Error al obtener users:', error);
                }
            };
            cargarUsers();
        }
    }, [hasFetchedUsers]);

    return (
        <div className={styles.todo}>
            <h1>Deportistas</h1>
            {users.length > 0 ? (
                users.map(user => (
                    <Usuario 
                        key={user.id} 
                        nombre={user.nombre} 
                        avatar={user.avatar}
                    />
                ))
            ) : (
                <p>Cargando usuarios...</p>
            )}
        </div>
    );
}
