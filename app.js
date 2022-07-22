const express = require('express');
const keys = require('./config/keys');
const stripe = require('stripe')('sk_test_51KdcyrJXeDXD8UVPw20vlsV8TQn9mVN1v4R8YPRN1rd8SB24wzsxJijeVRCNCdvOccwPOQIJw0NDuGuOq4pOADJS00T9RsnOwQ');
const exphbs = require('express-handlebars');



//initialize the app with express library
const app = express();

//Handlebars middleware
app.engine('handlebars', exphbs.engine({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

//Middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//Set Static Folder
app.use(express.static(`${__dirname}/public`));

//Index/home  Route
app.get('/', (_req, res) => {
    res.render('home', {
        stripePublishableKey: keys.stripePublishableKey
    });
});


app.get('/success', (_req,res) => {
    res.render('success');
});

//Charge Route
app.post('/charge', (req, res) => {
    const amount = 2500;
    
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
    })
    .then(customer => stripe.charges.create({
        amount,
        description:"Foot Wear by Shop Hive",
        currency:'usd',
        customer:customer.id
    }))
    .then(_charge => res.render('success'));
});


const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
 
