const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8mgufzz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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
        // await client.connect();

        const craftCollection = client.db("craftDB").collection("crafts");
        const categoryCollection = client.db("craftDB").collection("categories");





        // Get Many for All crafts and craft items
        app.get('/crafts', async (req, res) => {
            const cursor = craftCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // GET single for craft item details
        app.get('/crafts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await craftCollection.findOne(query);
            res.send(result);
        })

        // GET Single Find For all craft details
        app.get('/craft/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await craftCollection.findOne(query);
            res.send(result)
        })


        // GET MANY for My Added Craft section
        app.get('/myCrafts/:email', async (req, res) => {
            const userEmail = req.params.email;
            const query = { email: userEmail }
            const cursor = craftCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })


        // DELETE
        app.delete('/myCrafts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await craftCollection.deleteOne(query);
            res.send(result);
        })



        // GET single for for update crafts default value
        app.get('/myCraft/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await craftCollection.findOne(query);
            res.send(result);

        })


        // PUT OR UPDATe
        app.put('/myCraft/:id', async (req, res) => {
            const id = req.params.id;
            const craft = req.body;
            console.log(id, craft);
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateCraft = {
                $set: {
                    name: craft.name,
                    price: craft.price,
                    description: craft.description,
                    customization: craft.customization,
                    processing: craft.processing,
                    subCategory: craft.subCategory,
                    rating: craft.rating,
                    stockStatus: craft.stockStatus,
                    photo: craft.photo
                },
            };

            const result = await craftCollection.updateOne(filter, updateCraft, options);
            res.send(result);

        })





        // CATEGORIES data
        app.get('/categories', async (req, res) => {
            const cursor = categoryCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // by use GET to get all subcategory related data from crafts collection
        app.get('/categories/:subCategory', async (req, res) => {
            const subCategory = req.params.subCategory;
            const query = { subCategory: subCategory };
            const result = await craftCollection.find(query).toArray();
            res.send(result);
        })
    



        // post
        app.post('/crafts', async (req, res) => {
            const craft = req.body;
            // console.log(craft);
            const result = await craftCollection.insertOne(craft);
            res.send(result);
        })






        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('EcoKrafts server running..');
})


app.listen(port, () => {
    console.log(`EcoKrafts server is running at port:${port}`);
})