"use client"

import Title from "./title";
import Button from "./button";

export default function Form(props){
    return(
        <form>
            <Title text={props.text}/>
            <input type="text"/>
            <input type="number"/>
            <Button text={props.textBtn1}/>
            <Button text={props.textBtn2}/>
        </form>
    )
}
