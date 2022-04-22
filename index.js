const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//midlewar

app.use(cors());
app.use(express.json());

// mongo db connection

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ilylj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
    try {
        await client.connect();
        const postDatabase = client.db('minimo-post').collection('posts');
        app.post('/', async (req, res) => {
            const post = req.body;
            const result = await postDatabase.insertOne(post);
            res.send(result);
        })
    }
    finally {

    }
}
run().catch(console.dir)
app.get('/', (req, res) => {
    res.send('this is your response')
})
app.listen(port)

