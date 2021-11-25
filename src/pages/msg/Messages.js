import React, { useState, useEffect, useCallback } from 'react'

export const Messages = ({ socket }) => {

    const [messages, setMessages] = useState([])

    const addMessage = useCallback( (msg) => {
        setMessages( messages => [...messages, msg])
    }, [setMessages]);
    
    useEffect( () => {
        socket.on('chat message', function(msg) {
            addMessage(msg)
        });
    }, [addMessage, socket])

    return (
        <>
            <ul id="messages">
                {
                    messages.map( (e) =>
                        <li key={e}>{e}</li>
                    )
                }
            </ul> 
        </>
    )
}
