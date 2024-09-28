"use client"
import styles from "./Button.module.css"
import clsx from "clsx";

export default function Button(props) {

    return (
      <button type="button" className={
        clsx(
          {
            [styles.button]: true,
            [styles.variant_jugar]: props.variant == "jugar",
            [styles.variant_puntuacion]: props.variant == "puntuacion",
            [styles.variant_salir]: props.variant == "salir"
          }
        )}  
        onClick={props.onClick}>{props.text}</button>
    );
}
