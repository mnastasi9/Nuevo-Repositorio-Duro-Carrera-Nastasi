"use client"
import Button from "@/components/button";
import { useEffect } from "react";
import { useSocket } from "@/hooks/useSocket";
import { useState } from "react";

export default function ranking() {
    const {socket, isConnected} = useSocket();
    const [message, setMessage]= useState("");

    useEffect(() => {
        if(!socket) return;
        socket.on("pingAll", (data) =>{
            console.log("Mensaje recibido: ", data);
        })

        socket.on("newMessage", (data) =>{
            console.log("Mensaje recibido de la sala: ", data);
        })
    }, [socket, isConnected]);

    function handlePing() {
        socket.emit("pingAll", {message})
    }

    function handleSendMessage(){
        socket.emit('sendMessage', {message: message})
    }

    function handleChangeInput(event){
        setMessage(event.target.value)
    }

    return (
        <>
            <h1>Soy la ruta/ranking/users</h1>
            <Button onClick={handlePing} text="Ping all"/>
            <Button onClick={() => socket.emit('joinRoom', {room: "chismesin"})} text="Conectar/Unirse a la sala"/>
            <input onChange={handleChangeInput}/>
            <Button onClick={handleSendMessage} text="Enviar mensaje"/>
        </>
      )
  }