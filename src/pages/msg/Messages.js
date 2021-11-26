import React, { useState, useEffect, useCallback } from 'react'
import NodeRSA from 'node-rsa';
import { useToasts } from 'react-toast-notifications';

import '../../index.css';

export const Messages = ({ socket }) => {
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

    return (
        <>
            <div className="msg">
                <div className="area">
                    <div id="messages">
                        {
                            messages.map( (e) =>
                                <div className="bn" key={e.id}>
                                    <div className="content">
                                        <label className="usr"> <strong>{e.user}</strong> </label>
                                        <label> {e.msg} </label>
                                    </div>
                                </div>
                            )
                        }
                    </div> 
                </div>
            </div>
        </>
    )
}
