import Quill from "quill"
import 'quill/dist/quill.snow.css'
import { useCallback } from "react"
import './Editor.css'

export default function Editor() {

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
        new Quill(editor, options);
    })

    return (
        <div id="container" ref={wrapperRef}></div>
    )
}
