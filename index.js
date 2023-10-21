const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



app.get('/', (req, res) => {
    res.send('CarHub server is running')
})

// mongodb connection

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.efnyjsd.mongodb.net/?retryWrites=true&w=majority`;


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

    app.get('/cars', async(req, res) => {
        const cursor = carsInfo.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    // update car info
    app.get('/carInfo/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const cursor = await carsInfo.findOne(query);
        res.send(cursor);
    })

    app.put('/cars/:id', async(req, res) => {
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)};
        const options = {upsert: true};
        const updatedCarInfo = req.body;
        const carUpdate = {
            $set: {
                brandName: updatedCarInfo.brandName,
                brandLogo: updatedCarInfo.brandLogo,
                carName: updatedCarInfo.carName,
                carImage: updatedCarInfo.carImage,
                rating: updatedCarInfo.rating,
                review: updatedCarInfo.review,
                transmission: updatedCarInfo.transmission,
                mileage: updatedCarInfo.mileage,
                model: updatedCarInfo.model,
                enginType: updatedCarInfo.enginType,
                price: updatedCarInfo.price,
                details: updatedCarInfo.details,
                bodyTypes: updatedCarInfo.bodyTypes,
                color: updatedCarInfo.color
            }
        }
        const result = await carsInfo.updateOne(filter, carUpdate, options);
        res.send(result)
    })

    app.get('/cars/:brandName', async(req, res) => {
        const name = req.params.brandName;
        // console.log("from server", name)
        const query = {brandName : name}
        const cursor = await carsInfo.find(query).toArray();
        res.send(cursor)
    })

    app.get('/car/:id', async(req, res) => {
        const id = req.params.id;
        console.log("from server", id)
        const query = {_id : new ObjectId(id)}
        const cursor = await carsInfo.find(query).toArray();
        res.send(cursor)
    })

    // app.get('/cars/:id', async (req, res) => {
    //     const id = req.params.id;
    //     const query = {_id : new ObjectId(id)};
    //     console.log('This is from',query);
    //     const cursor = carsInfo.find(query);
    //     const result = await cursor.toArray();
    //     res.send(result);
    // })


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
