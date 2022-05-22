const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())






const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://electricTools:<password>@cluster0.f9lm3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const ToolsCollection = client.db("Products").collection("tools");

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