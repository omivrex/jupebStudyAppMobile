import React from "react"
const MathJax = {
    tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']]
    }
}
const mathJaxLibrary = require('../utils/mathjaxweb.utils')

const genStyles = {
    'WebkitUserSelect': 'none',
    'MozUserSelect': 'none',
    'msUserSelect': 'none',
    'userSelect': 'none',
    'fontSize': '1em',
    'fontFamily': 'Roboto, sans-serif, san Francisco'
}

const WebMathJaxComponent = ({data, style}) => {
    return (
        <div style={{...style, ...genStyles }} className="dataContainer" dangerouslySetInnerHTML={{
            __html: data+
            `<script>
                (()={
                    window.MathJax.typeset()
                    console.log('running MathJax')
                })()
            </script>`
        }}/>
    )
}

export default WebMathJaxComponent