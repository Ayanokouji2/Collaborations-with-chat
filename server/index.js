import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io'
import { createServer } from 'http'
import './connect.js';
import { createNewOrGetOldDocument, updateDocument } from './helper/Functions.js'


const app = express()
const PORT = 5000;
const corsOption = {
    origin: 'http://localhost:5173',
    method: ['GET', 'POST']
}

app.use(express.json());
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: corsOption })



io.on('connection', socket => {

    socket.on('get-document', async documentId => {

        const document = await createNewOrGetOldDocument(documentId);
        socket.join(documentId)

        socket.emit('load-document',document.data);

        socket.on('auto-save-document', async data=>{
           
            await updateDocument(documentId, data);
        })

        socket.on('send-change', delta => {
            socket.broadcast.to(documentId).emit('receive-change', delta);
        })

    })

    

})




httpServer.listen(PORT, () => {
    console.log(`Server is Listening in port http://localhost:${PORT}`);
})

