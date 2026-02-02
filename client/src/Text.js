import React from 'react'

function Text({ text, user }) {
  const isMe = user === "Me";

  return (
    <div className={`textBox ${isMe ? "me" : "other"}`}>
      {!isMe && <div className="user">{user}</div>}
      <div>{text}</div>
    </div>
  );
}

export default Text;

