import React, { useEffect, useState } from 'react'

import openSocket from 'socket.io-client';
import { constants } from '../../constants/constants';
import { useForm } from '../../hooks/useForm';

export const ChatPage = () => {
    
    
    const socket = openSocket(constants.socketURL, {transports: ['websocket']});
    const [values, handleInputChange, reset] = useForm({ message: '' });
    const {message} = values;
    const [messages, setMessages] = useState([])
    
    useEffect( () => {
        socket.on('chat message', function(msg) {
            setMessages([...messages, msg])
        });
    } )

    const sendMessage = (e) => {
        e.preventDefault()
        if (message.length&&message!==' ') {
            socket.emit('chat message', message);
            reset()
        }
    }

    return (
        <>
            <h1>Hi Chat Page</h1>
            <ul id="messages">
                {
                    messages.map( (e) =>
                        <li key={e}>{e}</li>
                    )
                }
            </ul>
            <form id="form" action="">
            <input value={message} name="message" autoComplete="off" onChange={handleInputChange}/>
            <button onClick={sendMessage}>Send</button>
            </form>
        </>

    )
}