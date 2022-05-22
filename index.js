const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000
const stripe = require('stripe')(process.env.PAYMENT_SECRET_KEY);



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
        const reviewCollection = client.db("Products").collection("reviews");
        //   all get method   / /
        app.get('/tools', async (req, res) => {
            const tools = await toolsCollection.find().toArray();
            res.send(tools)
        })
        app.get('/tools/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const findTool = await toolsCollection.findOne(query);
            res.send(findTool)
        })
        // show purchase orders
        app.get('/orders', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const orders = await PurchaseCollection.find(query).toArray();
            res.send(orders)
        })
        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const orders = await PurchaseCollection.find(query).toArray();
            res.send(orders)
        })

        app.get('/reviews',async(req,res)=>{
            const reviews= await reviewCollection.find().toArray();
            res.send(reviews)
        })




        // all Post method //
        app.post('/purchase', async (req, res) => {
            const purchaseTool = req.body;
            const result = await PurchaseCollection.insertOne(purchaseTool);
            res.send(result)
        })

        // payment method api 
        app.post('/create-payment', async (req, res) => {
            const { newPrice } = req.body;
            const amount = newPrice * 100;
            const payment = await stripe.paymentIntents.create({
                amount: amount,
                currency: 'usd',
                payment_method_types: ['card']
            })
            res.send({ clientSecret: payment.client_secret })
        })


        app.post('/addReview', async (req, res)=>{
            const review = req.body;
            const addReview = await reviewCollection.insertOne(review);
            res.send(addReview)
        })


        // using patch 
        app.patch('/purchase/:id', async (req, res) => {
            const id = req.params.id;
            const payment = req.body;
            const filter = { _id: ObjectId(id) };
            const updatedDoc = {
                $set: {
                    paid: true,
                    transactionId: payment.transactionId
                }
            }
            const updatePayment = await PurchaseCollection.updateOne(filter, updatedDoc);
            res.send(updatePayment)
        })

        // delete purchase tool
        app.delete('/deletePurchaseTool/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const deleteTool = await PurchaseCollection.deleteOne(query);
            res.send(deleteTool)
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