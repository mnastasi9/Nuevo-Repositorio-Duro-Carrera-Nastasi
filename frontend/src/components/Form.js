"use client"
import { useState } from "react";
import Input from "./Input";

function Form(props) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    alert('Form submitted with input: ' + inputValue);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input handleChange={props.handleChange}/>
    </form>
  );
}

export default Form;