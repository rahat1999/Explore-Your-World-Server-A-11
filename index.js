const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

/* ==MiddelWare== */
app.use(cors())
app.use(express.json())

/*====== mongodb============ */
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2rvjh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("exploreYourWorld");
        const touringSpotCollection = database.collection("touringSpot");
        const coustomerBookingCollection = database.collection("coustomerBooking");

        /* ======Get touring spot api========= */
        app.get('/touringSpot', async (req, res) => {
            const result = await touringSpotCollection.find({}).toArray();
            res.send(result)
        })
        /* ========= addTour Post Api ==========*/
        app.post('/addTour', async (req, res) => {
            const result = await touringSpotCollection.insertOne(req.body)
            res.send(result)
        })

        /* =====Fina single touring spot by id ======*/
        app.get('/singleTourSpot/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await touringSpotCollection.findOne(query)
            res.send(result)
        })

        /*======= Insert booking post Api ============= */
        app.post('/bookingPlace', async (req, res) => {
            const result = await coustomerBookingCollection.insertOne(req.body)
            res.send(result)
        })

        /* ======= get bookingsport api======== */
        app.get('/bookingPlace', async (req, res) => {
            const result = await coustomerBookingCollection.find({}).toArray();
            res.send(result)
        })

        /*======== Bookin Delete Api=========== */
        app.delete('/bookingPlace/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await coustomerBookingCollection.deleteOne(query)
            // console.log('delete', id)
            res.send(result)
        })





    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Explore Your World')
})

app.listen(port, () => {
    console.log(`Running app listening at http://localhost:${port}`)
})
