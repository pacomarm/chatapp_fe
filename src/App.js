import { ChatPage } from "./pages/chat/Chat";
import openSocket from 'socket.io-client';

import { constants } from './constants/constants';
import { Messages } from "./pages/msg/Messages";
import { useState } from "react";

export const  App = () => {
  const [show, setShow] = useState(false)
  const socket = openSocket(constants.socketURL, {transports: ['websocket']});

  return (
    <>
      <h1>Hi Chat Page</h1>
      {
        !show && (
          <>
            <form id="form" action="">
                <input value={message} name="message" autoComplete="off" onChange={handleInputChange}/>
                <button onClick={sendMessage}>Send</button>
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
