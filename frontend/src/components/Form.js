"use client"; // Indica que este archivo debe ejecutarse en el lado del cliente (browser).
import { useState } from "react"; // Importa el hook useState de React.
import Input from "./Input"; // Importa el componente Input.

function Form(props) {
  const [inputValue, setInputValue] = useState(''); // Define el estado para almacenar el valor del input.

  // Maneja el envío del formulario.
  const handleSubmit = (event) => {
    event.preventDefault(); // Previene el comportamiento predeterminado de envío del formulario.
    alert('Form submitted with input: ' + inputValue); // Muestra una alerta con el valor del input.
  };

  return (
    <form onSubmit={handleSubmit}> {/* Asocia el evento onSubmit con la función handleSubmit */}
      <Input handleChange={props.handleChange} /> {/* Renderiza el componente Input y pasa la función handleChange como prop */}
    </form>
  );
}

export default Form; // Exporta el componente Form para ser utilizado en otras partes de la aplicación.
