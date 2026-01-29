import './App.css';
import io from 'socket.io-client';
import Text from './Text';
import {useEffect, useState, useRef} from 'react';


function App() {

  const socketRef = useRef(null);

  const [message, setMessage] = useState("");
  const [user, setUser] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  // const [messageRecieved, setMessageRecieved] = useState("");
  const [room, setRoom] = useState("");
  const [inRoom, setInRoom] = useState(false);


  const sendMessage = () => {
    socketRef.current.emit("send_message", {message,user,room});
    setMessages(prev => [...prev, message]);
    setUsers(prev => [...prev, "Me"]);
  };

  const joinRoom = () => {
    if (room !== "" && user !== ""){
      socketRef.current.emit("join_room",room);
      setMessage("");
      setInRoom(true);
    }
  }

  const leaveRoom = () => {
    setRoom("");
    setInRoom(false);
    setMessages([]);
    setUsers([]);
  }

  useEffect(() => {
    socketRef.current = io("https://web-socket-project-yqkf.onrender.com");

    socketRef.current.on("recieve_message", (data) => {
      setMessages(prev => [...prev, data.message]);
      setUsers(prev => [...prev, data.user]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  return (
    <div className="App">
      <div className='topBar'>
        {inRoom ? ( 
          <div className='inRoomBar'>
            <div>
              <button onClick={leaveRoom}>Leave Room</button>
            </div>
            <div>
            <input placeholder='Message...' value={message} onChange={(event) => {
              setMessage(event.target.value);
            }}></input>
            <button onClick={sendMessage}>Send Message</button>
            </div>
          </div>
        ) : (
          <div className='outRoomBar'>
            <div>
              <input placeholder='Enter Name...' onChange={(event) => {
                setUser(event.target.value);
              }}></input>
            </div>
            <div>
              <input placeholder='Room Number...' value={room} onChange={(event) => {
                setRoom(event.target.value);
              }}></input>
              <button onClick={joinRoom}>Join Room</button>
            </div>
          </div>
        )}
      </div>
      <div className='messageBox'>
        {messages.map((msg, index) => (
          <Text
            text={msg}
            user= {users[index]}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
