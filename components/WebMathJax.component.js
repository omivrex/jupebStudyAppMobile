import React from "react"
const MathJax = {
    tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']]
    }
}
const mathJaxLibrary = require('../utils/mathjaxweb.utils')

const genStyles = {
    'webkitUserSelect': 'none',
    'mozUserSelect': 'none',
    'msUserSelect': 'none',
    'userSelect': 'none',
    'fontSize': '1em',
    'fontFamily': 'Roboto, sans-serif, san Francisco'
}

const WebMathJaxComponent = ({data, style}) => {
    return (
        <div style={style} className="dataContainer" dangerouslySetInnerHTML={{__html: data+'<script>window.MathJax.typeset()</script>'}}/>
    )
}

export default WebMathJaxComponent