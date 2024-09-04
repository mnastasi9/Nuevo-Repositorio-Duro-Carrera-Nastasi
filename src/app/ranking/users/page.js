"use client"

import { useSocket } from '@/hooks/useSocket';
import { useEffect } from 'react';
import Button from '@/components/button';

export default function UsersRanking(){

    //Le aclaro a la pagina o componente  que quiero usar el  hook useSocket
    const {socket, isConnected} = useSocket();
    useEffect(()=>{
      //Para evitar que genere errores si no esta el socket
      if(!socket)return;
      socket.on('pingAll', (data) => {
        console.log("Me llego el evento pingAll", data);
      })
  
  
    },[socket, isConnected]);
  
    function handleClick() {
      socket.emit('pingAll', {message: "feli 5cm"});
    }
  
    return(
      <>
        <h1>Soy la ruta /ranking/users</h1>
        <Button onClick={handleClick} text="Enviar pingAll" />
      </>
    )
  }