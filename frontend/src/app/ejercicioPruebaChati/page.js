"use client";
import styles from "./page.module.css";
import Button from "@/components/button";
import { useState } from "react";

export default function EjercicioChati() {
  const [tareas, setTareas] = useState([]); // Estado para la lista de tareas
  const [nuevaTarea, setNuevaTarea] = useState(''); // Estado para la nueva tarea
  
  function ingresarTarea(e) {
    e.preventDefault(); // Evita el comportamiento predeterminado del formulario
    if (nuevaTarea.trim()) { // Verifica que la tarea no esté vacía
      setTareas([...tareas, nuevaTarea]); // Añade la nueva tarea a la lista
      setNuevaTarea(''); // Limpia el campo de entrada
    }
  }

  return (
    <div className={styles.todo}>
      <div className={styles.inicio}>
        <br />
        <p className={styles.texto}>Tareas</p>
        <form onSubmit={ingresarTarea}>
          <input
            type="text"
            onChange={(e) => setNuevaTarea(e.target.value)} // Actualiza la tarea en el input
            value={nuevaTarea}
            placeholder="Escribe una tarea"
          />
        </form> 
        <br />
        <Button
          text="Ingresar Tarea"
          variant="jugar"
          className={styles.buttonJugar}
          onClick={ingresarTarea} // También permite agregar la tarea al hacer clic en el botón
        />
        <ul>
          {tareas.map((tarea, index) => (
            <li key={index}>{tarea}</li> // Muestra la lista de tareas
          ))}
        </ul>
      </div>
    </div>
  );
}

