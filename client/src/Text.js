import React from 'react'

function Text({text,user}) {
  return (
    <div className='textBox'>
        <div className='user'>
            {user}:&nbsp; 
        </div>
        <div className='text'>
            {text}
        </div>
    </div>
  )
}

export default Text