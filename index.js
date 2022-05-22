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
        const PurchaseCollection = client.db("Products").collection("purchase");
        //   all get method   / /
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
        // show purchase orders
        app.get('/orders',async(req,res)=>{
            const email = req.query.email;
            const query = {email: email}
            const orders = await PurchaseCollection.find(query).toArray();
            res.send(orders)
        })
        app.get('/orders/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const orders = await PurchaseCollection.find(query).toArray();
            res.send(orders)
        })
        
        // all Post method //
        app.post('/purchase',async (req,res)=>{
            const purchaseTool = req.body;
            const result = await PurchaseCollection.insertOne(purchaseTool);
            res.send(result)
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