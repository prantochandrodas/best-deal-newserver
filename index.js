const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();
require('dotenv').config();

//middleware 
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pbafkul.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
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
        const countriesCollection = client.db('bestTravel').collection('countrys');
        const packageCollection = client.db('bestTravel').collection('packageDetails');
        const packageDetailsCollection = client.db('bestTravel').collection('package');
        const bookingCollection = client.db('bestTravel').collection('bookingCollection');
        const countryDetails = client.db('bestTravel').collection('bookingCollection');
        app.get('/countries', async (req, res) => {
            const query = {};
            const result = await countriesCollection.find(query).toArray();
            res.send(result);
        });

        app.get('/packageDetails', async (req, res) => {
            const query = {};
            const result = await packageDetailsCollection.find(query).toArray();
            res.send(result);
        });

        app.post('/addBooking', async (req, res) => {
            const booking = req.body;
            console.log(booking);
            const id = req.body.package_id;
            const newEmail = req.body.email;
            const query = { package_id: id, email: newEmail }
            const findWatchLater = await bookingCollection.findOne(query);

            if (findWatchLater) {
                res.send(false);
            } else {
                const result = await bookingCollection.insertOne(booking);
                res.send(result);

            }

        })

        app.get('/countriesDetails', async (req, res) => {
            const query = {};
            const result = await countryDetails.find(query).toArray();
            res.send(result);
        });

        app.get('/countriesDetails/:id', async (req, res) => {
            const newid = req.params.id;
            const query = { Country_id: newid };
            const result = await countryDetails.findOne(query);
            res.send(result);
        })
        app.get('/package', async (req, res) => {
            const query = {};
            const result = await packageCollection.find(query).toArray();
            const count = await packageCollection.estimatedDocumentCount();
            res.send({ count, result });
        });

        app.get('/allpackage', async (req, res) => {
            const page=req.query.page;
            const size=parseInt(req.query.size);
            console.log(page,size);
            const query = {};
            const result = await packageCollection.find(query).skip(page*size).limit(size).toArray();
            const count = await packageCollection.estimatedDocumentCount();
            res.send({ count, result });
        });
    } finally {

    }
}
run().catch(error => console.log(error));



app.get('/', (req, res) => {
    res.send('best-travel server is running')
});

app.listen(port, () => console.log(`best-travel server is running on ${port}`))