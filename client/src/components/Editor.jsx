import Quill from "quill"
import 'quill/dist/quill.snow.css'
import { useCallback, useState, useEffect } from "react"
import './Editor.css'
import { io } from 'socket.io-client'
import { useParams } from "react-router-dom"

const ToolBar_Option = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", 'underline'],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: 'super' }],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"]
]



export default function Editor() {
    const [socket, setSocket] = useState();
    const [quill, setQuill] = useState();

    const { id } = useParams();

    useEffect(() => {
        const s = io('http://localhost:5000/');

        setSocket(s);
        return () => {
            s.disconnect();
        }
    }, [])

    useEffect(() => {
        if (socket == null || quill == null) return

        const handler = (delta, oldDelta, source) => {
            if (source !== 'user') return
            socket.emit('send-change', delta)
        }

        quill.on('text-change', handler)

        return () => {
            quill.off('text-change', handler)
        }

    }, [quill, socket])

    useEffect(() => {
        if (socket == null || quill == null) return

        const handler = (change) => {
            quill.updateContents(change)
        }
        socket.on('receive-change', handler)

        return () => {
            socket.off('receive-change', handler)
        }

    }, [quill, socket])

    useEffect(() => {
        if (socket === null || quill == null) return

        socket.emit('get-document', documentId)

        socket.once('load-document', docuemnt=>{
            
        })
    }, [socket, quill, documentId])
    const wrapperRef = useCallback(wrapper => {

        if (wrapper == null) return

        const options = {
            debug: 'info',
            modules: {
                toolbar: ToolBar_Option,
            },
            theme: 'snow'
        };

        wrapper.innerHTML = '';

        const editor = document.createElement('div');
        wrapper.append(editor);
        const q = new Quill(editor, options);
        setQuill(q);
    }, [])


    return (
        <div id="container" ref={wrapperRef}></div>
    )
}
