import styles from "./Input.module.css"; // Importa los estilos CSS del módulo.
import clsx from "clsx"; // Importa la biblioteca clsx para manejar clases condicionales.

export default function Input(props) {
    return (
        <input
            type="text" // Define el tipo de input como texto.
            id="inputField" // Asigna un ID al input para poder seleccionarlo.
            value={props.value} // Establece el valor del input utilizando la prop 'value' recibida.
            onChange={props.handleChange} // Asocia la función 'handleChange' a los cambios en el input.
            className={clsx(
                {
                    [styles.inputlogin]: true // Aplica la clase 'inputlogin' desde el módulo de estilos.
                }
            )}
        />
    );
}
