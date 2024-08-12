"use client"
import Title from "@/components/title";
import Button from "@/components/button";
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
      <h2>Contador: {cuenta}</h2>
      <input type="checkbox" id="decrementar" name="decrementar"/>
      <label for="decrementar">decrementar</label>
      <Button onClick={incrementarodecrementar} text="Realizar"/>
    </div>
  )
}