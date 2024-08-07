"use client"

import styles from "./page.module.css";

export default function Home(){
  function login (){
    console.log("Apretaste el boton Login");
}
  return (
    <main className={styles.main}>
      <Form title="Titulo del formulario 1" textBtn1= "Login" onClickBtn1={Login} textBtn2="Registrarse"/>
      <Form title="Titulo del formulario 2" textBtn1= "Login" textBtn2="Registrarse"/>
      <Form title="Titulo del formulario 3" textBtn1= "Login" textBtn2="Registrarse"/>
      <Form title="Titulo del formulario 4" textBtn1= "Login" onClickBtn1={Login} textBtn2="Registrarse"/>
    </main>
  );
}