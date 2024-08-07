"use client"

import Title from "./title";
import Button from "./button";

export default function Form(props){
    return(
        <form>
            <Title text={props.text}/>
            <input type="text"/>
            <input type="number"/>
            <button text={props.textBtn1}/>
            <button text={props.textBtn2}/>
        </form>
    )
}
