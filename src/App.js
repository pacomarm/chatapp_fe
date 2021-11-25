import { ChatPage } from "./pages/chat/Chat";
import openSocket from 'socket.io-client';

import { constants } from './constants/constants';
import { Messages } from "./pages/msg/Messages";

export const  App = () => {

  const socket = openSocket(constants.socketURL, {transports: ['websocket']});

  return (
    <>
      <h1>Hi Chat Page</h1>
      <Messages socket={socket}/>
      <ChatPage socket={socket}/>
    </>
  );
}

export default App;
