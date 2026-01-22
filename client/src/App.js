import './App.css';
import io from 'socket.io-client';
import {useEffect, useState} from 'react';
const socket = io.connect("https://web-socket-project-yqkf.onrender.com");


function App() {

  const [message, setMessage] = useState("");
  const [messageRecieved, setMessageRecieved] = useState("");
  const [room, setRoom] = useState("");

  const sendMessage = () => {
    socket.emit("send_message", {message,room});
  };

  const joinRoom = () => {
    if (room !== ""){
      socket.emit("join_room",room);
    }
  }

  useEffect(() => {
    socket.on("recieve_message", (data) => {
      setMessageRecieved(data.message);
    })
  }, [socket]);

  return (
    <div className="App">
      <input placeholder='Room Number...' onChange={(event) => {
        setRoom(event.target.value);
      }}></input>
      <button onClick={joinRoom}>Join Room</button>
      <input placeholder='Message...' onChange={(event) => {
        setMessage(event.target.value);
      }}></input>
      <button onClick={sendMessage}>Send Message</button>
      <h1>{messageRecieved}</h1>
    </div>
  );
}

export default App;
