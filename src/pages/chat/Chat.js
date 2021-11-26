import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShare } from '@fortawesome/free-solid-svg-icons'
import NodeRSA from 'node-rsa';

import { useForm } from '../../hooks/useForm';

import '../../index.css'

export const ChatPage = ({socket}) => {
    
    const [values, handleInputChange, ] = useForm({ message: '' });
    const {message} = values;

    const encryptMessage = (msg) => {
        const pubkey = localStorage.getItem('zpub');
        // console.log('pubkey OG', pubkey);
        console.log('pubkey type', typeof(pubkey));
        if(pubkey){
            const key = new NodeRSA();
            // const newkey = pubkey.trim();
            // console.log('trimmed', newkey);
            key.importKey(pubkey, 'pkcs8-public-pem');
            const encrypted = key.encrypt(msg);
            console.log('encrypted message', encrypted);
        }
    };

    const sendMessage = (e) => {
        e.preventDefault()
        console.log('msggg');
        if (message.length&&message!==' ') {
            // socket.emit('chat message', message);
            // reset()
            encryptMessage()
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