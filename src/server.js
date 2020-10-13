// general dependencies
const express = require('express');
const render = require('express-react-views');
const bodyParser = require('body-parser');
const path = require('path');

// data dependency
const data = require('./data');


const timeStamp = (req) => {
    const date = new Date();
    const currentTimeStamp = date.getTime();
    console.log(`${currentTimeStamp} - ${req.protocol}//${req.headers.host}${req.originalUrl}`);
};

const create = async () => {

    const dbConnected = await data.connectToDatabase();

    const app = express();
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.static('public'));
    app.set('views', path.join(__dirname, './views'));
    app.set('view engine', 'jsx');
    app.engine(
        'jsx',
        render.createEngine({ beautify: true })
    );
    // Display form and table
    app.get('/', async (req, res) => {

        timeStamp(req);

        const initialData = {
            data: [],
            dbStatus: !!dbConnected
        };

        // get all items
        initialData.data = dbConnected
            ? await data.findDocuments({})
            : initialData;

        // return react front-end
        res.render('index', initialData);
    });
    // Insert row into table
    app.post('/', async (req, res) => {
        timeStamp(req);

        // insert
        if (req.body && Object.keys(req.body).length > 0) {
            const newItem = [req.body];

            // insert params to db
            await data.insertDocuments(newItem);
        }

        // return react front-end
        res.redirect('/');
    });
    // Delete 1 or all - depending on query string
    app.get('/delete', async (req, res) => {
        timeStamp(req);

        const docs = req.query && req.query.id ? { _id: data.ObjectId(req.query.id) } : {};

        // delete
        await data.removeDocuments(docs);

        res.redirect('/');
    });

    // instead of 404 - just return home page
    app.get('*', (req, res) => {
        timeStamp(req);

        res.redirect('/');
    });

    return app;
};

module.exports = {
    create
};
