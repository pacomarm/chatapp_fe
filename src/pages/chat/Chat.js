import React from 'react'
import { useForm } from '../../hooks/useForm';

export const ChatPage = ({socket}) => {
    
    const [values, handleInputChange, reset] = useForm({ message: '' });
    const {message} = values;

    const sendMessage = (e) => {
        e.preventDefault()
        if (message.length&&message!==' ') {
            socket.emit('chat message', message);
            reset()
        }
    }

    return (
        <>
            <form id="form" action="">
                <input value={message} name="message" autoComplete="off" onChange={handleInputChange}/>
                <button onClick={sendMessage}>Send</button>
            </form>
        </>

    )
}