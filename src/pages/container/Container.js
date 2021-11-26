import React, { useState, useEffect, useCallback } from 'react'
import NodeRSA from 'node-rsa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShare } from '@fortawesome/free-solid-svg-icons'
import { useToasts } from 'react-toast-notifications';
import { useForm } from '../../hooks/useForm';

import '../../index.css';

const user = localStorage.getItem('user');

export const Container = ({socket}) => {

    //messages
    const { addToast } = useToasts();
    const [messages, setMessages] = useState([])

    const addMessage = useCallback( (msg) => {
        setMessages( messages => [...messages, msg])
    }, [setMessages]);

    const decryptMessage = (message, user) => {
        const myprv = localStorage.getItem('myprv');
        // const userID = localStorage.getItem('userID');
        if(myprv){
            // if(myprv){
                const key = new NodeRSA();
                key.importKey(myprv, 'pkcs1-private-pem');
                return key.decrypt(message, 'utf8');
            // }
        }
    };
    
    useEffect( () => {
        socket.on('chat:message', (message) => {
            console.log(message)
            const decryptedMessage = decryptMessage(message.text.encrypted, message.userID);
            addMessage({user: message.username, msg: decryptedMessage, id: new Date()})
            addToast(`${message.username}: ${decryptedMessage}`, { appearance: 'success'});
            console.log(`${message.username}: ${decryptedMessage} `);
        });
        // socket.on('chat message', function(msg) {
        //     addMessage(msg)
        // });
    }, [addMessage, socket, addToast])

    // chat

    const [values, handleInputChange, reset] = useForm({ message: '' });
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
            addMessage({user: user, msg: message, id: new Date()})
            reset()
        }
    }

    return (
        <>
            <div className="msg">
                <div className="area">
                    <div id="messages">
                        {
                            messages.map( (e) =>
                                <div className="bn" key={e.id}>
                                    <div className="content">
                                        <label className={`${user==e.user ? 'usr' : 'other' }`}> <strong>{user==e.user ? 'You' : e.user}</strong> </label>
                                        <label> {e.msg} </label>
                                    </div>
                                </div>
                            )
                        }
                    </div> 
                </div>
            </div>
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
