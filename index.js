const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ashifxp007
// xeFizSFq1S36eAND

app.get('/', (req, res) => {
    res.send('CarHub server is running')
})

// mongodb connection



const uri = "mongodb+srv://ashifxp007:xeFizSFq1S36eAND@cluster0.efnyjsd.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const carsInfo = client.db("carsDB").collection("carsInfo")

    app.post('/cars', async (req, res) => {
        const cars = req.body;
        const result = await carsInfo.insertOne(cars);
        res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.listen(port, () => {
    console.log(`Server is running on ${port}`)
})
