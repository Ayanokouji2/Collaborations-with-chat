import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io'
import { createServer } from 'http'


const app = express()
const PORT = 5000;
const corsOption = {
    origin : 'http://localhost:5173',
    method:['GET','POST']
}

app.use(express.json());
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: corsOption })

io.on('connection', socket =>{
    
    console.log("socket.id",socket.id);
    socket.on('send-change', delta =>{
        socket.broadcast.emit('receive-change',delta);
    })

    socket.on('get-docuemnt',getOrCreateDocument)
    
})


httpServer.listen(PORT, () => {
    console.log(`Server is Listening in port http://localhost:${PORT}`);
})
    
