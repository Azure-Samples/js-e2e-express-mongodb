const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectID;

const insertDocuments = async (
    db,
    collectionName = 'documents',
    documents = [{ a: 1 }, { a: 2 }, { a: 3 }]
) => {
    if (!db || !collectionName || !documents)
        throw Error('insertDocuments::missing required params');

    // Get the collection
    const collection = await db.collection(collectionName);
    // Insert some documents
    await collection.insertMany(documents);
};
const findDocuments = async (
    db,
    collectionName = 'documents',
    query = { a: 3 }
) => {
    if (!db || !collectionName)
        throw Error('findDocuments::missing required params');

    // Get the collection
    const collection = await db.collection(collectionName);

    // find documents
    await collection.find(query).toArray();
};

const removeDocuments = async (
    db,
    collectionName = 'documents',
    docFilter = {}
) => {
    if (!db || !collectionName)
        throw Error('removeDocuments::missing required params');

    // Get the documents collection
    const collection = await db.collection(collectionName);

    // Delete document
    await collection.deleteMany(docFilter);
};

const removeDocument = async (db, collectionName = 'documents', id) => {
    if (!db || !collectionName || !id)
        throw Error('removeDocument::missing required params');

    // Get the documents collection
    const collection = await db.collection(collectionName);

    // Delete document
    await collection.deleteOne({ _id: ObjectId(id) });
};

const indexCollection = async (
    db,
    collectionName = 'documents',
    index = { a: 1 }
) => {
    if (!db || !collectionName || !index)
        throw Error('indexCollection::missing required params');

    if (!db || !collectionName) return;

    await db.collection(collectionName).createIndex(index, null);
};

const connect = async (url) => {
    if (!url) throw Error('connect::missing required params');

    return MongoClient.connect(url, { useUnifiedTopology: true });
};
const disconnect = async (client) => {
    if (!client) throw Error('disconnect::missing required params');

    client.close();
};

module.exports = {
    insertDocuments,
    findDocuments,
    removeDocument,
    removeDocuments,
    indexCollection,
    connect,
    disconnect,
};
