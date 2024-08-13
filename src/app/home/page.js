"use client"
import Title from "@/components/title";
import Button from "@/components/button";
import styles from "./page.module.css"
import clsx from "clsx";

import { useState } from "react";

export default function home() {
  let [cuenta, setCuenta] = useState(0);
  function incrementarodecrementar() {
    let decrementar = document.getElementById("decrementar").checked
    
    if (decrementar==false) {
      setCuenta(cuenta+=1);
    } else {
      setCuenta(cuenta-=1);
    }
    
  }
  return(
    <div>
      <Title titulo="Home"/>
      <h2>Contador: <span className={
        clsx
        (
          {
            [styles.contador_menor]: cuenta<0,
            [styles.contador_mayor]: cuenta>0
          }
        )
      }>{cuenta}</span></h2>
      <div className={styles.label}>
      <input type="checkbox" id="decrementar" name="decrementar" className={styles.input}/>
      <label for="decrementar">decrementar</label>
      </div>
      <Button variant="primary" onClick={incrementarodecrementar} text="Realizar"/>
      <Button variant="primary" text="Primario"/>
      <Button variant="secundary" text="Secundario"/>
      <Button variant="ok" text="Ok"/>
    </div>
  )
}