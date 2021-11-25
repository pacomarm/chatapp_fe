import { ChatPage } from "./pages/chat/Chat";
import openSocket from 'socket.io-client';

import { constants } from './constants/constants';
import { Messages } from "./pages/msg/Messages";
import { useState } from "react";
import { useForm } from "./hooks/useForm";

export const  App = () => {

  const [show, setShow] = useState(false)
  const [values, handleInputChange, reset] = useForm({ name: '', room: ''});
  const {name, room} = values;
  const socket = openSocket(constants.socketURL, {transports: ['websocket']});

  const startConnection = (e) => {
    e.preventDefault()
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
                  <label class="form-label">Name</label>
                  <input className="form-control" value={name} name="name" autoComplete="off" onChange={handleInputChange}/>
                </div>
                <div className="mb-3">
                  <label class="form-label">Room</label>
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
