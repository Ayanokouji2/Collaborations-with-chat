import Quill from "quill"
import 'quill/dist/quill.snow.css'
import { useCallback, useState, useEffect } from "react"
import './Editor.css'
import { io } from 'socket.io-client'

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

    useEffect(() => {
        const socket = io('http://localhost:5000');

        setSocket(socket);
        return () => {
            socket.disconnect();
        }
    }, [])

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
