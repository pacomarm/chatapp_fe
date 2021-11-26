// import { ChatPage } from "./pages/chat/Chat";
import { io } from 'socket.io-client';
// import NodeRSA from 'node-rsa';
import QuickEncrypt from 'quick-encrypt'
import { useToasts } from 'react-toast-notifications';

// import { constants } from './constants/constants';
// import { Messages } from "./pages/msg/Messages";
import { useEffect, useState } from "react";
import { useForm } from "./hooks/useForm";
import { Container } from "./pages/container/Container";

export const  App = () => {
  const { addToast } = useToasts();
  const [show, setShow] = useState(false)
  const [values, handleInputChange, ] = useForm({ name: '', room: ''});
  const {name, room} = values;
  
  const [socket, setSocket] = useState(null);
  
  useEffect(() => {
    // const newSocket = io(constants.socketURL);
    const newSocket = io('/', { rejectUnauthorized: false });
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket]);
  
  const generateRSAKeys = (username) => {
    
    let key = QuickEncrypt.generate(2048)
    const publicKey  = key.public
    const privateKey = key.private
    localStorage.setItem('mypub', publicKey)
    localStorage.setItem('myprv', privateKey)
    return publicKey;
  };

  const welcome = () => {
    socket.on('joinRoom:welcome', (message) => {
      console.log(message)
      localStorage.setItem('user', message.username)
    });
  };

  const newUser = () => {
    socket.on('joinRoom:newUser', (message) => {
      // console.log(message.text);
      addToast(message.text, { appearance: 'success' });
    });
  };

  const storePubKeys = (pubkey, username) => {
    socket.on('joinRoom:shareKeys', (keys) => {
      keys.forEach((key) => {
        let tmpKey = key.toString();
        if (tmpKey !== pubkey.toString()) {
          localStorage.setItem('zpub', key)
        }
      });
    });
  };
  
  const startConnection = (e) => {
    e.preventDefault()
    if(name&&room&&name!==''&&room!==''){
      const pubkey = generateRSAKeys(name);
      if(pubkey){
        // console.log(name)
        socket.emit('joinRoom', { username: name, roomname: room, pubkey: pubkey });
        welcome();
        newUser();
        storePubKeys(pubkey, name);
        addToast('Connected Successfully', { appearance: 'success' });
        setShow(true)
      }
    } else{
      addToast('Invalid Credentials', { appearance: 'error' });
    }
  }
  

  return (
    <>
      <div style={{display:'flex', justifyContent: 'center'}}>
        <h1>WhatsUp</h1>
      </div>
      {
        !show && (
          <>
            <form id="form" className="m-3">
                <div className="mb-3">
                  <label className="form-label"><strong>Name</strong></label>
                  <input className="form-control" value={name} name="name" autoComplete="off" onChange={handleInputChange}/>
                </div>
                <div className="mb-3">
                  <label className="form-label"><strong>Room</strong></label>
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
            {/* <Messages socket={socket}/>
            <ChatPage socket={socket}/> */}
            <Container socket={socket}></Container>
          </>
        )
      }
    </>
  );
}

export default App;
