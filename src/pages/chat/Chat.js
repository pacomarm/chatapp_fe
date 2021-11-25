import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShare } from '@fortawesome/free-solid-svg-icons'
import { useForm } from '../../hooks/useForm';

import '../../index.css'

export const ChatPage = ({socket}) => {

    console.log(socket);
    
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
            <form id="form" className="m-3">
                <div style={{display:'flex'}}>
                    <input 
                        value={message} name="message" 
                        autoComplete="off" onChange={handleInputChange}
                        className="form-control"
                    />
                    <button className="btn btn-success bts" onClick={sendMessage} > <FontAwesomeIcon icon={faShare} /> </button>
                </div>
            </form>
        </>

    )
}