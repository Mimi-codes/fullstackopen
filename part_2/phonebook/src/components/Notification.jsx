import React from 'react'

const Notification = ({message}) => {
const notificationStyle = {
        color: 'green',
        border: '2px solid green',
      padding: '0.5rem',
      marginBottom: '1rem',
        background: 'lightgray'
}
    if (message === null) {
    return null
}

return (
    <div style={notificationStyle}>
{message}
    </div>
  )
}

export default Notification 