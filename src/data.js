const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectID;
// read .env file
require('dotenv').config();

const { getSecret } = require("./azure/azure-keyvault");

/* eslint no-return-await: 0 */



let dbConfig = null;
let mongoConnection = null;
let db = null;

/* eslint no-console: 0 */

const getConnectionConfiguration = async () => {
    
    const KEY_VAULT_CONNECTION_STRING_SECRET_NAME =  process.env.KEY_VAULT_SECRET_NAME_DATABASEURL;
    const KEY_VAULT_NAME = process.env.KEY_VAULT_NAME;
    
    if (!KEY_VAULT_CONNECTION_STRING_SECRET_NAME || !KEY_VAULT_NAME) {
        throw Error("missing environment variables for Key Vault");
    }
    
    // Get Secret (Database Connection String) from Key Vault
    let DATABASE_URL = await getSecret(KEY_VAULT_CONNECTION_STRING_SECRET_NAME, KEY_VAULT_NAME);
    
    // database name
    const DATABASE_NAME = process.env.DATABASE_NAME || 'my-tutorial-db';
    
    // collection name
    const DATABASE_COLLECTION_NAME =
        process.env.DATABASE_COLLECTION_NAME || 'my-collection';
   
    if (!DATABASE_URL || !DATABASE_NAME || !DATABASE_COLLECTION_NAME) {
        throw Error("missing DB settings;")
    }

    dbConfig = {
        DATABASE_URL,
        DATABASE_NAME,
        DATABASE_COLLECTION_NAME
    }
}

const insertDocuments = async (
    documents = [{ a: 1 }, { a: 2 }, { a: 3 }]
) => {
    // check params
    if (!db || !documents)
        throw Error('insertDocuments::missing required params');

    // Get the collection
    const collection = await db.collection(dbConfig.DATABASE_COLLECTION_NAME);

    // Insert some documents
    return await collection.insertMany(documents);
};
const findDocuments = async (
    query = { a: 3 }
) => {
    
    // check params
    if (!db)
        throw Error('findDocuments::missing required params');

    // Get the collection
    const collection = await db.collection(dbConfig.DATABASE_COLLECTION_NAME );

    // find documents
    return await collection.find(query).toArray();
};

const removeDocuments = async (docFilter = {}) => {
    
    // check params
    if (!db )
        throw Error('removeDocuments::missing required params');

    // Get the documents collection
    const collection = await db.collection(dbConfig.DATABASE_COLLECTION_NAME);

    // Delete document
    return await collection.deleteMany(docFilter);
};

const connect = async (url) => {
    
    // check params
    if (!url) throw Error('connect::missing required params');

    return MongoClient.connect(url, { useUnifiedTopology: true });
};
/* 
eslint consistent-return: [0, { "treatUndefinedAsUnspecified": false }]
*/
const connectToDatabase = async () => {
    try {
        
        await getConnectionConfiguration();

        mongoConnection = await connect(dbConfig.DATABASE_URL);
        db = mongoConnection.db(dbConfig.DATABASE_NAME);

        console.log(`DB connected = ${!!db}`);
        
        return !!db;

    } catch (err) {
        console.log('DB not connected - err');
        console.log(err);
    }
};
module.exports = {
    insertDocuments,
    findDocuments,
    removeDocuments,
    ObjectId,
    connectToDatabase
};
