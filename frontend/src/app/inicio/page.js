"use client"; // Indica que este archivo debe ejecutarse en el lado del cliente (browser).

import Form from "@/components/Form"; // Importa el componente Form desde la ruta especificada.
import styles from "./page.module.css"; // Importa los estilos CSS de la hoja de estilos local.
import Button from "@/components/button"; // Importa el componente Button desde la ruta especificada.
import { useState } from "react"; // Importa el hook useState de React para gestionar el estado del componente.
import { useRouter } from "next/navigation"; // Importa useRouter para manejar la navegación en Next.js.

export default function inicio() { // Define el componente funcional 'inicio'.
  const router = useRouter(); // Crea una instancia de router para manejar la navegación.
  const [inputNombre, setInputNombre] = useState(""); // Inicializa el estado para el nombre de usuario.
  const [inputPassword, setInputPassword] = useState(""); // Inicializa el estado para la contraseña.
  const [userAvatar, setUserAvatar] = useState(""); // Inicializa el estado para el avatar del usuario.
  const [userID, setUserID] = useState(0); // Inicializa el estado para el ID del usuario.

  async function ingresarUsuario() { // Función asincrónica para ingresar al usuario.
    const usuario = await existeUsuario(); // Llama a existeUsuario y espera su resultado.

    if (usuario) { // Si el usuario existe,
      const { userAv, userId } = usuario; // Desestructura el avatar y el ID del usuario.
      alert("Has ingresado"); // Muestra un mensaje de alerta.
      router.push(`/?avatar=${userAv}&idUsuario=${userId}`); // Redirige al usuario a la página principal con parámetros en la URL.
    } else {
      alert("El usuario no existe o la contraseña no es correcta"); // Muestra un mensaje de error si el usuario no existe.
    }
  }

  async function existeUsuario() { // Función asincrónica para verificar la existencia del usuario.
    const data = { // Crea un objeto con los datos del usuario.
      nombre_usuario: inputNombre, // Asigna el nombre de usuario ingresado.
      contraseña: inputPassword, // Asigna la contraseña ingresada.
    };

    const response = await fetch("http://localhost:4000/usuarios", { // Realiza una petición POST al servidor.
      method: "POST", // Define el método HTTP como POST.
      headers: { // Define los encabezados de la petición.
        "Content-Type": "application/json", // Especifica que el contenido es JSON.
      },
      body: JSON.stringify(data), // Convierte el objeto data a una cadena JSON.
    });

    const result = await response.json(); // Espera y convierte la respuesta a formato JSON.
    if (result.length === 0) { // Si no hay resultados,
      console.log("El usuario no existe"); // Muestra un mensaje en la consola.
      return false; // Devuelve false indicando que el usuario no existe.
    } else {
      console.log("El usuario sí existe"); // Muestra un mensaje en la consola si el usuario existe.
      const userAv = result[0].avatar; // Obtiene el avatar del primer usuario en el resultado.
      const userId = result[0].id; // Obtiene el ID del primer usuario en el resultado.
      console.log(result); // Muestra el resultado en la consola.
      setUserAvatar(userAv); // Actualiza el estado del avatar del usuario.
      setUserID(userId); // Actualiza el estado del ID del usuario.
      return { userAv, userId }; // Devuelve un objeto con el avatar y el ID del usuario.
    }
  }

  return ( // Renderiza el componente.
    <div className={styles.todo}> {/* Contenedor principal con estilos. */}
      <div className={styles.inicio}> {/* Contenedor para el inicio de sesión. */}
        <br></br> {/* Salto de línea. */}
        <p className={styles.texto}>Nombre de usuario</p> {/* Texto para el campo de nombre de usuario. */}
        <Form handleChange={(e) => setInputNombre(e.target.value)} /> {/* Componente Form que maneja el cambio de nombre. */}
        <br></br> {/* Salto de línea. */}
        <p className={styles.texto}>Contraseña</p> {/* Texto para el campo de contraseña. */}
        <Form handleChange={(e) => setInputPassword(e.target.value)} /> {/* Componente Form que maneja el cambio de contraseña. */}
        <br></br> {/* Salto de línea. */}
        <Button
          text="Ingresar" // Texto del botón.
          variant="jugar" // Variante del botón para aplicar estilos específicos.
          className={styles.buttonJugar} // Clases CSS para el botón.
          onClick={ingresarUsuario} // Maneja el clic en el botón llamando a la función ingresarUsuario.
        ></Button>
      </div>
    </div>
  );
}
