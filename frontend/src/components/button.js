"use client"; // Indica que este archivo debe ejecutarse en el lado del cliente (browser).

import styles from "./Button.module.css"; // Importa los estilos CSS del archivo Button.module.css.
import clsx from "clsx"; // Importa la biblioteca clsx para manejar condicionalmente las clases CSS.

export default function Button(props) { // Define el componente funcional Button, que recibe props como argumento.
    return (
        <button 
            type="button" // Establece el tipo del botón como "button".
            className={ // Define las clases del botón usando clsx.
                clsx(
                    {
                        [styles.button]: true, // Siempre aplica la clase button.
                        [styles.variant_jugar]: props.variant === "jugar", // Aplica la clase variant_jugar si la prop variant es "jugar".
                        [styles.variant_puntuacion]: props.variant === "puntuacion", // Aplica la clase variant_puntuacion si la prop variant es "puntuacion".
                        [styles.variant_salir]: props.variant === "salir" // Aplica la clase variant_salir si la prop variant es "salir".
                    }
                )  
            }
            onClick={props.onClick} // Establece la función onClick que se ejecutará al hacer clic en el botón.
        >
            {props.text} // Muestra el texto pasado como prop en el botón.
        </button>
    );
}

