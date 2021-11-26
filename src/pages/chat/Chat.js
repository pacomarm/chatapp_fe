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
        if(pubkey){
            const key = new NodeRSA();
            key.importKey(pubkey, 'pkcs1-public-pem');
            return key.encrypt(msg,'base64');

            // const prvk = new NodeRSA();
            // prvk.importKey(myprv, 'pkcs1-private-pem');
            // console.log('decrypted message', prvk.decrypt(encrypted3, 'utf8'));
        }
    };

    const sendMessage = (e) => {
        e.preventDefault()
        if (message.length&&message!==' ') {
            // socket.emit('chat message', message);
            // reset()
            const encrypted = encryptMessage(message)
            socket.emit('chat', { encrypted });
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