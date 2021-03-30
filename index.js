const express = require('express');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;

const password = 'rabiul28036'

const uri = "mongodb+srv://rabiul:rabiul28036@cluster0.y5f6g.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res)=> {
    res.sendFile(__dirname + '/index.html');
})




client.connect(err => {
  const productCollection = client.db("organicdb").collection("products");
  
  app.get('/products', (req, res) => {
    productCollection.find({})
    // productCollection.find({}).limit(4)
    .toArray( (err, documents) =>{
      res.send(documents);
    })
  })

  app.get('/product/:id', (req, res) => {
    productCollection.find({_id: ObjectId(req.params.id)})
    .toArray ( (err, documents) =>{
      res.send(documents[0]);
    })
  })
  

  app.post("/addProduct", (req, res)=>{
      const product = req.body;
    //   console.log(product);
    productCollection.insertOne(product)
    .then(result => {
        console.log("data added successfully");
        // res.send('success');
        res.redirect('/')
      })
  })

  app.patch('/update/:id', (req, res) => {
    console.log(req.body.price)
    productCollection.updateOne({_id: ObjectId(req.params.id)},
    {
      $set: {price: req.body.price, quantity: req.body.quantity}
    })
    .then (result => {
      res.send(result.modifiedCount > 0)
      // console.log(result);
    })
  })

  app.delete('/delete/:id', (req, res) =>{
    productCollection.deleteOne({_id:  ObjectId(req.params.id)})
    .then( result => {
      res.send(result.deletedCount > 0);
      // console.log(result)
    })
  })
});








app.listen(3000);