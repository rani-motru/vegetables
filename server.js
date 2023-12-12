require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const Fruit = require('./models/fruit.js');
const Vegetable = require('./models/vegetable.js');
const jsxViewEngine = require('jsx-view-engine');


//global configuration
const mongoURI = process.env.MONGO_URI;
const db = mongoose.connection;

//connect to mongo
mongoose.connect(mongoURI);
mongoose.connection.once('open', () =>{
    console.log('connected to Mongo');
})

app.set('view engine', 'jsx');
app.set('views', './views');
app.engine('jsx', jsxViewEngine());

// moving the fruits to models/fruits.js in order to have compartmentalized code
// we are using MVC - models-views-controllers - architecture
// https://developer.mozilla.org/en-US/docs/Glossary/MVC
// const fruits = [
//     {
//         name:'apple',
//         color: 'red',
//         readyToEat: true
//     },
//     {
//         name:'pear',
//         color: 'green',
//         readyToEat: false
//     },
//     {
//         name:'banana',
//         color: 'yellow',
//         readyToEat: true
//     }
// ];

// ================ Middleware ================
//
app.use((req, res, next) => {
    console.log('Middleware: I run for all routes');
    next();
})

//near the top, around other app.use() calls
app.use(express.urlencoded({extended:false}));

// These are my routes
// We are going to create the 7 RESTful routes
// There is an order for them to listed in the code
// I - N - D - U - C - E - S
//  Action      HTTP Verb   CRUD 
// I - Index    GET         READ - display a list of elements
// N - New      GET         CREATE * - but this allows user input
// D - Delete   DELETE      DELETE
// U - Update   PUT         UPDATE * - this updates our database
// C - Create   POST        CREATE * - this adds to our database
// E - Edit     GET         UPDATE * - but this allows user input
// S - Show     GET         READ - display a specific element

app.get('/', (req, res) => {
    res.send('this is my fruits and vegetable root route');
});

// I - INDEX - dsiplays a list of all fruits
app.get('/fruits/', async (req, res) => {
    // res.send(fruits);
    // res.render('fruits/Index', {fruits: fruits});
    try{
        const foundFruits = await Fruit.find({});
        res.status(200).render('fruits/Index', {fruits: foundFruits});
    } catch (err){
        res.status(400).send(err)
    }
    

});
// Index for vegetables:
app.get('/vegetables/', async (req, res) => {
    // res.send(fruits);
    //  res.render('vegetables/Index', {vegetables: vegetables});
    try{
        const foundVegetables = await Vegetable.find({});
        res.status(200).render('vegetables/Index', {vegetables: foundVegetables});
    } catch (err){
        res.status(400).send(err)
    }
    
});


// N - NEW - allows a user to input a new fruit
app.get('/fruits/new', (req, res) => {
    res.render('fruits/New');
});

// N - NEW - allows a user to input a new vegetable
app.get('/vegetables/new', (req, res) => {
    res.render('vegetables/New');
});

// C - CREATE - update our data store
app.post('/fruits', async (req, res) => {
    if(req.body.readyToEat === 'on') { //if checked, req.body.readyToEat is set to 'on'
        req.body.readyToEat = true;
    } else {  //if not checked, req.body.readyToEat is undefined
        req.body.readyToEat = false;
    }
    try{
        const createdFruit = await Fruit.create(req.body);
        res.status(200).redirect('/fruits');
      } catch (err) {
      res.status(400).send(err);
   }
    // fruits.push(req.body);
    // console.log(fruits);
    // console.log(req.body)
    // res.send('data received');
    // res.redirect('/fruits'); // send user back to /fruits
})

// C - CREATE - update our data store
app.post('/vegetables', async (req, res) => {
    if(req.body.readyToEat === 'on') { //if checked, req.body.readyToEat is set to 'on'
        req.body.readyToEat = true;
    } else {  //if not checked, req.body.readyToEat is undefined
        req.body.readyToEat = false;
    }
    try{
        const createdVegetable = await Vegetable.create(req.body);
        res.status(200).redirect('/vegetables');
      } catch (err) {
      res.status(400).send(err);
   }
    // vegetables.push(req.body);
    // console.log(fruits);
    // console.log(req.body)
    // res.send('data received');
    // res.redirect('/vegetables'); // send user back to /fruits
})

// S - SHOW - show route displays details of an individual fruit
app.get('/fruits/:id', async (req, res) => {
    // res.send(fruits[req.params.indexOfFruitsArray]);
    // res.render('fruits/Show', {// second parameter must be an object
    //
    try {
        const foundFruit = await Fruit.findById(req.params.id);
        res.render('fruits/show',{fruit: foundFruit});
    } catch(err){
        res.status(400).send(err);
    }   
    
})

// S - SHOW - show route displays details of an individual v
app.get('/vegetables/:id', async (req, res) => {
    // res.send(fruits[req.params.indexOfFruitsArray]);
    //   res.render('vegetables/Show', {// second parameter must be an object
    //   vegetable: vegetables[req.params.indexOfVegetablesArray]
    // });
    try {
        const foundVegetable = await Vegetable.findById(req.params.id);
        res.render('vegetables/show',{vegetable: foundVegetable});
    } catch(err){
        res.status(400).send(err);
    }     
    
})

app.listen(3000, () => {
    console.log('listening');
});