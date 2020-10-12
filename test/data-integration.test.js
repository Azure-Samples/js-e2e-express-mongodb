const data = require('../src/data');
require('dotenv').config();

// Test requires connection to DB
const DATABASE_URL = process.env.DATABASE_URL
    ? process.env.DATABASE_URL
    : 'mongodb://localhost:27017';
const DATABASE_NAME = process.env.DATABASE_NAME || 'my-tutorial-db';
const DATABASE_COLLECTION_NAME =
    process.env.DATABASE_COLLECTION_NAME || 'my-collection';

const DATABASE_DOCS = [{ a: 1 }, { a: 2 }, { a: 3 }];
const ALL_DOCS = {};

describe('mongoDB native API', () => {
    test('integration with DB', async (done) => {
        const dbProcess = async (url, dbName, collectionName, docs) => {
            const client = await data.connect(url);

            const db = await client.db(dbName);
            expect(db).not.toBe(undefined);

            const insertResult = await data.insertDocuments(
                db,
                collectionName,
                docs
            );
            expect(insertResult).not.toBe(undefined);

            // get first ID of array - delete later
            const id = insertResult.insertedIds[0].toString();

            const findResult = await data.findDocuments(
                db,
                collectionName,
                ALL_DOCS
            );
            expect(findResult.length).not.toBe(0);

            const count = findResult.length;

            await data.removeDocument(db, collectionName, id);

            const findResult2 = await data.findDocuments(
                db,
                collectionName,
                ALL_DOCS
            );
            expect(findResult2.length).not.toBe(0);

            expect(findResult2.length).toEqual(count - 1);

            const removeResult = await data.removeDocuments(
                db,
                collectionName,
                ALL_DOCS
            );
            expect(removeResult).not.toBe(undefined);

            const findResult3 = await data.findDocuments(
                db,
                collectionName,
                ALL_DOCS
            );
            expect(findResult3.length).toBe(0);

            await data.disconnect(client);
        };

        dbProcess(
            DATABASE_URL,
            DATABASE_NAME,
            DATABASE_COLLECTION_NAME,
            DATABASE_DOCS
        )
            .then(() => done())
            .catch((err) => done(err));
    });
});
