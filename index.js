// adding require
const express = require('express')  // for express
const cors = require('cors')    // for cors
require('dotenv').config()  // for dotenv
const MongoClient = require('mongodb').MongoClient; // for mongoDB
const ObjectId = require('mongodb').ObjectId; // for fetching specific object from mongoDB


// for setting the port for live hosting and localhost 
const port = process.env.PORT || 5055;

// 
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

    // collection for reviews
    const reviewsCollection = client.db("smartAssistanceDB").collection("reviews");

    // collection for orders
    const ordersCollection = client.db("smartAssistanceDB").collection("orders");

    // collection for users
    const usersCollection = client.db("smartAssistanceDB").collection("users");

    // test data
    // const newData = {"name":"test one"};
    // usersCollection.insertOne(newData)
    //     .then(result => { console.log(`Successfully inserted item with _id: ${result.insertedId}`)})
    //     .then(error => { if(error) {console.log(`Failed to insert item: ${error}`)} })

    // test data for review
    // const newReview = {
    //     "name":"Robert",
    //     "email":"robert@gmail.com",
    //     "reviewText":"Lorem ipsum adipisicing elit dolor corporis saepe sit amet consectetur , distinctio quae rem iure culpa!", 
    //     "image":"https://i.ibb.co/T0vDPfZ/client-3.jpg"
    // };
    // reviewsCollection.insertOne(newReview)
    //     .then(result => { console.log(`Successfully inserted item with _id: ${result.insertedId}`)})
    //     .then(error => { if(error) {console.log(`Failed to insert item: ${error}`)} })


    // getting all services from server
    app.get('/getServices', (req, res) => {
        servicesCollection.find()
            .toArray((err, products) => {
                res.send(products)
            })
    })


    // getting specific user clicked service from server
    app.get('/getService/:id', (req, res) => {
        const id = ObjectId(req.params.id);
        servicesCollection.findOne({ _id: id })
            .then(documents => {
                // console.log(documents);
                res.send(documents);
            })
    })


    // adding a service to server
    app.post('/addService', (req, res) => {
        const newService = req.body;
        // console.log("New Product:", newProduct);
        servicesCollection.insertOne(newService)
            .then(result => {
                console.log(`Successfully add service with _id: ${result.insertedId}`)
                res.send(result.insertedId > 0)
            })
            .catch(err => { console.error(`Failed to add service: ${err}`) })
    })   


    // updating a service from the server
    app.patch('/updateService/:id', (req, res) => {

        servicesCollection.updateOne({_id: ObjectId(req.params.id)},
        {
            $set: {name: req.body.name, description: req.body.description, price: req.body.price}
        }
        )
        .then(result => {
            // console.log(result);
            console.log("Data Updated Successfully")
            res.send(result.modifiedCount > 0)
        })
        .catch(err => { console.error(`Failed to update service: ${err}`) })
    })
    
    
    // deleting a service from server
    app.delete('/deleteService/:id', (req, res) => {
        const id = ObjectId(req.params.id);
        // console.log('select for delete: ', id);
        servicesCollection.findOneAndDelete({ _id: id })
            .then(documents => {
                res.send(!!documents.value)
            })
    })


    // getting all reviews from server
    app.get('/getReviews', (req, res) => {
        reviewsCollection.find()
            .toArray((err, review) => {
                res.send(review)
            })
    })

    // sending a review to server
    app.post('/addReview', (req, res) => {
        const newReview = req.body;
        console.log(newReview);
        reviewsCollection.insertOne(newReview)
        .then(result => {
            console.log(`Successfully inserted review with _id: ${result.insertedId}`)
            res.send(result.insertedId > 0)
        })
        .catch(err => { console.error(`Failed to insert item: ${err}`) })
    })


    // sending a order to server
    app.post('/addOrder', (req, res) => {
        const newOrder = req.body;
        // console.log(newOrder);
        ordersCollection.insertOne(newOrder)
        .then(result => {
            console.log(`Successfully inserted review with _id: ${result.insertedId}`)
            res.send(result.insertedId > 0)
        })
        .catch(err => { console.error(`Failed to insert item: ${err}`) })
    })


    // getting all orders from server
    app.get('/getOrders', (req, res) => {
        ordersCollection.find({email: req.query.email})
            .toArray((err, order) => {
                res.send(order)
            })
    })


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