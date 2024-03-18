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

const INTERVAL_TIME = 5 * 60 * 100; // 0.5 min or 30sec


export default function Editor() {
    const [socket, setSocket] = useState(null);
    const [quill, setQuill] = useState(null);

    const { id: documentId } = useParams();

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

        socket.once('load-document', document => {
            quill.setContents(document);
            quill.enable()
        })

        socket.emit('get-document', documentId)


    }, [socket, quill, documentId])

    useEffect(() => {
        if (quill == null || socket == null) return

        const interval = setInterval(() => {
            console.log('Interval Time is ', INTERVAL_TIME)
            socket.emit('auto-save-document', quill.getContents())

            // INTERVAL_TIME = 10 * 60 * 100;
        }, INTERVAL_TIME)

        return () => {
            clearInterval(interval)
        }

    }, [socket, quill])

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
        q.setText('Your Document is Loading...!');
        q.disable();
        setQuill(q);
    }, [])


    return (
        <div id="container" ref={wrapperRef}></div>
    )
}
