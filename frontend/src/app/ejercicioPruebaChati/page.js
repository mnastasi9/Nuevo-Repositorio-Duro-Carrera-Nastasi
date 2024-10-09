"use client";
import styles from "./page.module.css";
import Button from "@/components/button";
import { useState } from "react";

export default function EjercicioChati() {
  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState('');
  
  function ingresarTarea() {
    if (nuevaTarea.trim()) { // Verifica que la tarea no esté vacía
        setTareas([...tareas, nuevaTarea]);
        setNuevaTarea(''); // Limpia el campo de entrada
      }
  }

  return (
    <div className={styles.todo}>
      <div className={styles.inicio}>
        <br />
        <p className={styles.texto}>Tareas</p>
        <form handleChange={(e) => setNuevaTarea(e.target.value)}>
            <input
                type="text"
                onChange={(e) => setNuevaTarea(e.target.value)}
                value={nuevaTarea}
                placeholder="Escribe una tarea"
            />
        </form> 
        <br />
        <Button
          text="Ingresar Tarea"
          variant="jugar"
          className={styles.buttonJugar}
          onClick={ingresarTarea}
        />
        <ul>
          {tareas.map((tarea, index) => (
            <li key={index}>{tarea}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
