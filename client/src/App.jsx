import Editor from "./components/Editor"
import socket from './Helper/socket';

function App() {
  console.log(socket);
  return (
    <Editor />
  )
}

export default App
