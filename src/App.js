import { ChatPage } from "./pages/chat/Chat";
import { io } from 'socket.io-client';
// import openSocket from 'socket.io-client';
// import NodeRSA from 'encrypt-rsa';
import NodeRSA from 'node-rsa';

import { constants } from './constants/constants';
import { Messages } from "./pages/msg/Messages";
import { useEffect, useState } from "react";
import { useForm } from "./hooks/useForm";

export const  App = () => {
  // const nodeRSA = new NodeRSA();
  const [show, setShow] = useState(false)
  const [values, handleInputChange, reset] = useForm({ name: '', room: ''});
  const {name, room} = values;
  
  const [socket, setSocket] = useState(null);
  
  useEffect(() => {
    const newSocket = io(constants.socketURL);
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket]);
  
  const generateRSAKeys = (username) => {
    // const { privateKey, publicKey } = nodeRSA.createPrivateAndPublicKeys();
    const key = new NodeRSA({b: 512});
    const publicKey = key.exportKey('public')
    const privateKey = key.exportKey('private')
    console.log(publicKey)
    console.log(privateKey)
    return publicKey;
  };
  
  const startConnection = (e) => {
    e.preventDefault()
    const pubkey = generateRSAKeys(name);
    // console.log(pubkey);
    reset()
    setShow(true)
  }
  

  return (
    <>
      <div className="mt-3" style={{display:'flex', justifyContent: 'center'}}>
        <h1>WhatsUp</h1>
      </div>
      {
        !show && (
          <>
            <form id="form" className="m-3">
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input className="form-control" value={name} name="name" autoComplete="off" onChange={handleInputChange}/>
                </div>
                <div className="mb-3">
                  <label className="form-label">Room</label>
                  <input className="form-control" value={room} name="room" autoComplete="off" onChange={handleInputChange}/>
                </div>
                <div style={{display:'flex', justifyContent: 'center'}}>
                  <button className="btn btn-outline-success" onClick={startConnection}>Connect</button>
                </div>
            </form>
          </>
        )
      }
      {
        show && (
          <>
            <Messages socket={socket}/>
            <ChatPage socket={socket}/>
          </>
        )
      }
    </>
  );
}

export default App;
