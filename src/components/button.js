"use client"
import styles from "./button.module.css"
import clsx from "clsx";

export default function Button(props) {

    return (
      <button type="button" className={
        clsx(
          {
            [styles.button]: true,
            [styles.variant_primary]: props.variant == "primary",
            [styles.variant_secundary]: props.variant == "secundary",
            [styles.variant_ok]: props.variant == "ok"
          }
        )}  
        onClick={props.onClick}>{props.text}</button>
    );
}
