import "./App.css";
import io from "socket.io-client";
import Text from "./Text";
import { useEffect, useState, useRef } from "react";

function App() {
  const socketRef = useRef(null);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [message, setMessage] = useState("");
  const [user, setUser] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [room, setRoom] = useState("");
  const [inRoom, setInRoom] = useState(false);

  const sendMessage = () => {
    if (message.trim() === "") return;

    socketRef.current.emit("send_message", { message, user, room });
    setMessages((prev) => [...prev, message]);
    setUsers((prev) => [...prev, "Me"]);
    setMessage("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
    }
  };

  const joinRoom = () => {
    if (room && user) {
      socketRef.current.emit("join_room", room);
      setInRoom(true);
    }
  };

  const leaveRoom = () => {
    setRoom("");
    setInRoom(false);
    setMessages([]);
    setUsers([]);
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    e.target.style.height = "40px";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  useEffect(() => {
    socketRef.current = io("https://web-socket-project-yqkf.onrender.com");

    socketRef.current.on("recieve_message", (data) => {
      setMessages((prev) => [...prev, data.message]);
      setUsers((prev) => [...prev, data.user]);
    });

    return () => socketRef.current.disconnect();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="App">
      {!inRoom ? (
        <div className="joinScreen">
          <input
            placeholder="Enter Name..."
            onChange={(e) => setUser(e.target.value)}
          />
          <input
            placeholder="Room Number..."
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <button onClick={joinRoom}>Join Room</button>
        </div>
      ) : (
        <>
          <div className="topBar">
            <button onClick={leaveRoom}>Leave Room</button>
          </div>

          <div className="messageBox">
            {messages.map((msg, index) => (
              <Text key={index} text={msg} user={users[index]} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="inputBar">
            <textarea
              ref={textareaRef}
              value={message}
              placeholder="Type a message..."
              onChange={handleTyping}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;


