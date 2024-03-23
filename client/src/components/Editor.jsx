import Quill from "quill"
import 'quill/dist/quill.snow.css'
import { useCallback, useState, useEffect, useRef } from "react"
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
    const [cursors, setCursors] = useState({})

    const { id: documentId } = useParams();
    const saveShortcutRef = useRef(null);


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
            socket.emit('auto-save-document', quill.getContents())

            // INTERVAL_TIME = 10 * 60 * 100;
        }, INTERVAL_TIME)

        return () => {
            clearInterval(interval)
        }

    }, [socket, quill])

    // saveShortcut will have the latest value of saveShortcutRef
    const saveShortcut = (...args) => saveShortcutRef.current(...args);

    saveShortcutRef.current = useCallback(
        (range, context) => {
            if (quill == null || socket == null) {
                console.error('Quill or socket is null:', quill, socket);
                return;
            }

            socket.emit('auto-save-document', quill.getContents());
        },
        [quill, socket]
    );

    const wrapperRef = useCallback(wrapper => {

        if (wrapper == null) return

        const options = {
            // debug: 'info', // Makes constant log in the console for helping in debug
            modules: {
                toolbar: ToolBar_Option,
                keyboard: {
                    bindings: {
                        save: {
                            key: 'S',
                            ctrlKey: true,
                            shiftKey: true,
                            handler: saveShortcut
                        }
                    }
                }
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

    /*
        Collaboration

        1. Login User to get Name  → redirect to select document to edit or create new Document 
        2. On Document’s Document(MonogDb) create a new Field called active User → when the user joins the room just insert the user in to the active user.
        3. Fetch the activeUser into react state in cursors.
        4. Display the user based on there range.index from the document.
    */

    const handleSelectionChange = (range, oldRange, source) => {
        if (quill == null || socket == null || range == null) return

        const id = Math.random().toString(36).substring(2, 11)


    }

    return (
        <div id="container" ref={wrapperRef}></div>
    )
}
