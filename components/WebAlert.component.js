import React, {useRef} from "react";
const WebAlert = ({title, body, closeFunc, isDismisable, children}) => {
  const dismisableVal = useRef(isDismisable?isDismisable:true)
  const wrapper = useRef()
  return (
    <div ref={wrapper} onClick={()=> dismisableVal?closeFunc():null} style={{
        position: 'absolute',
        background: 'rgba(65,65,65,0.5)',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'sans-serif'
    }}>
        <div style={{
            background: '#fff',
            margin: 'auto',
            position: 'relative',
            padding: '0.8rem',
            display: 'flex',
            width: '75%',
            height: 'fit-content',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <h3>{title}</h3>
            <p>{body}</p>
            {children}
        </div>
    </div>
  )
}

export default WebAlert