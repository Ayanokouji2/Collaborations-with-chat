import DocumentModel from "../model/documentModel.js";

export const createNewOrGetOldDocument = async (documentId) => {
    try {
        const defaultValue = ""
        if (documentId == null) return
        const document = await DocumentModel.findById(documentId);
        
        if (document)
            return document

        else
            return await DocumentModel.create({ _id: documentId, data: defaultValue })

    } catch (error) {
        console.log(`Error occurred in the Creation or Getting the Document from the database ❌ {error}`);
        throw error
    }
}

export const updateDocument = async (documentId, document) => {
    try {
        if (documentId == null || !document || !document.ops || !document.ops[0] || !document.ops[0].insert) {
            console.log("Invalid document structure or missing insert data.");
            return;
        }

        const updatedDoc = await DocumentModel.findByIdAndUpdate(documentId, { data: document });

        if (!updatedDoc) {
            console.log("Document not found.");
            return;
        }

    } catch (error) {
        console.log(`Error while updating document ❌ ${error}`);
        throw error;
    }
}

