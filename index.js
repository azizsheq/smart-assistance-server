const express = require('express')

// adding requirement for cors
const cors = require('cors')

// adding requirement for dotenv
require('dotenv').config()

// adding requirement for mongoDB
const MongoClient = require('mongodb').MongoClient;


// for setting the port for live hosting and localhost 
const port = process.env.PORT || 5055;

const app = express()

// adding middle wire
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l7yew.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// console.log("uri : ", uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

    // collection for services
    const servicesCollection = client.db("smartAssistanceDB").collection("services");

    // test data
    // const newData = {"name":"test one"};
    // servicesCollection.insertOne(newData)
    //     .then(result => { console.log(`Successfully inserted item with _id: ${result.insertedId}`)})
    //     .then(error => { if(error) {console.log(`Failed to insert item: ${error}`)} })

    //end
    if(err) { console.log("connection error: ", err); }
    // perform actions on the collection object
    // client.close();
});

// default from express.js
app.get('/', (req, res) => {
    res.send('Welcome, Smart Assistance Server is Running !')
})
app.listen(port, () => {
    console.log(`Server Running at :  http://localhost:${port}`)
})