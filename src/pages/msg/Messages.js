import React, { useState, useEffect, useCallback } from 'react'
import NodeRSA from 'node-rsa';
import '../../index.css';

export const Messages = ({ socket }) => {

    const [messages, setMessages] = useState([])

    const addMessage = useCallback( (msg) => {
        setMessages( messages => [...messages, msg])
    }, [setMessages]);

    const decryptMessage = (message) => {
        const myprv = localStorage.getItem('myprv');
        if(myprv){
            const key = new NodeRSA();
            key.importKey(myprv, 'pkcs1-private-pem');
            return key.decrypt(message, 'utf8');
        }
    };
    
    useEffect( () => {
        socket.on('chat:message', (message) => {
            console.log('cayó mensaje', message);
            const decryptedMessage = decryptMessage(message.text.encrypted);
            addMessage(decryptedMessage)
            console.log(`${message.username}: ${decryptedMessage} `);
        });
        // socket.on('chat message', function(msg) {
        //     addMessage(msg)
        // });
    }, [addMessage, socket])

    return (
        <>
            <div className="msg">
                <ul id="messages">
                    {
                        messages.map( (e) =>
                            <li key={e}>{e}</li>
                        )
                    }
                </ul> 
            </div>
        </>
    )
}
