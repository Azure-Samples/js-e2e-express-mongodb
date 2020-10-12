// general dependencies
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// data dependency
const data = require('./data');

// read .env file
require('dotenv').config();

const port = process.env.WEB_PORT || 8080;
const DATABASE_URL = process.env.DATABASE_URL
    ? process.env.DATABASE_URL
    : 'mongodb://localhost:27017';
const DATABASE_NAME = process.env.DATABASE_NAME || 'my-tutorial-db';
const DATABASE_COLLECTION_NAME =
    process.env.DATABASE_COLLECTION_NAME || 'my-collection';

let mongoConnection = null;
let db = null;

/* eslint no-console: 0 */
console.log(`DB:${DATABASE_URL}`);

const timeStamp = () => {
    const date = new Date();
    return date.getTime();
};

const connectToDatabase = async () => {
    try {
        if (!DATABASE_URL || !DATABASE_NAME) {
            // eslint-disable-next-line
            console.log('DB required params are missing');
            console.log(`DB required params DATABASE_URL = ${DATABASE_URL}`);
            console.log(`DB required params DATABASE_NAME = ${DATABASE_NAME}`);
            return;
        }

        if (DATABASE_URL && DATABASE_NAME) {
            mongoConnection = await data.connect(DATABASE_URL);
            db = mongoConnection.db(DATABASE_NAME);
        }
        console.log(`DB connected = ${!!db}`);
    } catch (err) {
        console.log('DB not connected - err');
        console.log(err);
    }
};

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'jsx');
app.engine(
    'jsx',
    require('express-react-views').createEngine({ beautify: true })
);
// Display form and table
app.get('/', async (req, res) => {
    
    console.log(
        `${timeStamp()} - ${req.protocol}//${req.headers.host}${
            req.originalUrl
        }`
    );

    const initialData = {
        data: [],
        dbStatus: !!db,
        title: 'Node.js with MongoDB',
    };

    // get all items
    initialData.data = db
        ? await data.findDocuments(db, DATABASE_COLLECTION_NAME, {})
        : initialData;

    // return react front-end
    res.render('index', initialData);
});
// Insert row into table
app.post('/', async (req, res) => {
    console.log(
        `${timeStamp()} - ${req.protocol}//${req.headers.host}${
            req.originalUrl
        }`
    );

    // insert
    if (req.body && Object.keys(req.body).length > 0) {
        const newItem = [req.body];

        // insert params to db
        await data.insertDocuments(db, DATABASE_COLLECTION_NAME, newItem);
    }

    // return react front-end
    res.redirect('/');
});
// Delete 1 or all - depending on query string
app.get('/delete', async (req, res) => {
    console.log(
        `${timeStamp()} - ${req.protocol}//${req.headers.host}${
            req.originalUrl
        }`
    );

    const id = req.query && req.query.id ? req.query.id : '';

    // delete
    await data.removeDocument(db, DATABASE_COLLECTION_NAME, { id });

    res.redirect('/');
});

// instead of 404 - just return home page
app.get('*', (req, res) => {
    console.log(
        `${timeStamp()} - ${req.protocol}//${req.headers.host}${
            req.originalUrl
        }`
    );

    res.redirect('/');
});

// Start Server
app.listen(port, async () => {
    try {
        await connectToDatabase();
        console.log(`Listening at http://localhost:${port}`);
    } catch (ex) {
        console.log(`server error: ${ex.message}`);
    }
});
