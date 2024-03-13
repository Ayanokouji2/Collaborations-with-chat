import Quill from "quill"
import 'quill/dist/quill.snow.css'
import { useCallback } from "react"

export default function Editor() {

    const wrapperRef = useCallback(wrapper => {

        if (wrapper == null) return

        const options = {
            debug: 'info',
            modules: {
                toolbar: true,
            },
            placeholder: 'Compose an epic...',
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
