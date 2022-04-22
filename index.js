const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//midlewar

app.use(cors());
app.use(express.json());

// mongo db connection

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ilylj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
    try {
        await client.connect();
        const postDatabase = client.db('minimo-post').collection('posts');
        // post a blog   
        app.post('/', async (req, res) => {
            const post = req.body;
            const result = await postDatabase.insertOne(post);
            res.send(result);
        });
        // get all the blogs
        app.get('/', async (req, res) => {
            const query = {}
            const cursor = postDatabase.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })
        //get blogs by author 
        app.get('/:uid', async (req, res) => {
            const authorId = req.params.uid;
            const query = { authorId: authorId }
            const cursor = postDatabase.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })
        //get a specific blog by ObjectId
        app.get('/post/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await postDatabase.findOne(query);
            res.send(result);
        })

        // update a blog
        app.put('/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const post = req.body;
            const updatedPost = {
                $set: post
            }
            const result = await postDatabase.updateOne(query, updatedPost);
            res.send(result);
        })
        //delete a blog
        app.delete('/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await postDatabase.deleteOne(query);
            res.send(result)
        })
       
    }

    finally {

    }
}
run().catch(console.dir)

app.listen(port)

