import openSocket from 'socket.io-client';

export const WhatsUp = () => {

  const socket = openSocket(constants.socketURL, {transports: ['websocket']});

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
