import { Schema, model } from 'mongoose';

const documentSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    data:{
        type: Object,
        required:true
    }
})

const DocumentModel  = model("Document",documentSchema);
export default DocumentModel