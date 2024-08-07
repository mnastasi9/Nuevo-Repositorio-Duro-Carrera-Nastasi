"use client"
import Button from "@/components/button";

export default function ranking() {

    function funcionBoton1() {
        console.log("Hola");
    }

    function funcionBoton2() {
        console.log("Chau");
    }

    return (
      <div>
          <h1>RANKING</h1>
          <h1>RANKING</h1>
          <h1>RANKING</h1>

          <Button onClick={funcionBoton1} text="Botón 1"/>
          <Button onClick={funcionBoton2} text="Botón 2"/>
      </div>
      )
  }