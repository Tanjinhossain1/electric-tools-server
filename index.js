const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())






const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f9lm3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const toolsCollection = client.db("Products").collection("tools");

        app.get('/tools',async(req,res)=>{
            const tools = await toolsCollection.find().toArray();
            res.send(tools)
        })
        app.get('/tools/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const findTool = await toolsCollection.findOne(query);
            res.send(findTool)
        })

    }
    finally {
        // client.close();
    }

}
run().catch(console.dir())









app.get('/', (req, res) => {
    res.send('Hello World! from tools')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})