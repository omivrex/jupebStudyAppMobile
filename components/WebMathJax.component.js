import React from "react"

const genStyles = {
    'WebkitUserSelect': 'none',
    'MozUserSelect': 'none',
    'msUserSelect': 'none',
    'userSelect': 'none',
    'fontSize': '1em',
    'fontFamily': 'Roboto, sans-serif, san Francisco'
}

const WebMathJaxComponent = ({data, style}) => {
    setTimeout(() => {
        window.MathJax.typeset()
    }, 700);
    return (
        <div style={{...style, ...genStyles }} className="dataContainer" dangerouslySetInnerHTML={{__html: data}}/>
    )
}

export default WebMathJaxComponent