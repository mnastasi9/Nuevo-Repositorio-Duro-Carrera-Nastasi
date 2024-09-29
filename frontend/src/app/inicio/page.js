"use client";
import Form from "@/components/Form";
import styles from "./page.module.css";
import Button from "@/components/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function inicio() {
  const router = useRouter();
  const [inputNombre, setInputNombre] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [userAvatar, setUserAvatar] = useState("");

  async function ingresarUsuario() {
    const avatarUsuario = await existeUsuario();
    if (avatarUsuario) {
      alert("Haz ingresado");
      router.push(`/?avatar=${avatarUsuario}`);
    } else {
      alert("El usuario no existe o la contraseña no es correcta");
    }
  }

  async function existeUsuario() {
    const data = {
      nombre_usuario: inputNombre,
      contraseña: inputPassword,
    };

    const response = await fetch("http://localhost:3000/usuarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (result.length === 0) {
      console.log("El usuario no existe");
      return false;
    } else {
      console.log("El usuario sí existe");
      const userAv = result[0].avatar;
      console.log(result)
      setUserAvatar(userAv); 
      return userAv; 
    }
  }

  return (
    <div className={styles.todo}>
      <div className={styles.inicio}>
        <br></br>
        <p className={styles.texto}>Nombre de usuario</p>
        <Form handleChange={(e) => setInputNombre(e.target.value)} />
        <br></br>
        <p className={styles.texto}>Contraseña</p>
        <Form handleChange={(e) => setInputPassword(e.target.value)} />
        <br></br>
        <Button
          text="Ingresar"
          variant="jugar"
          className={styles.buttonJugar}
          onClick={ingresarUsuario}
        ></Button>
      </div>
    </div>
  );
}
