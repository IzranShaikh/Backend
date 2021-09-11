const express = require('express');
const app = express();
const port = 6002;
const mongoose = require('mongoose');
const { message } = require('statuses');
const Customer = require('./customer-model');
const urlPrefix = "/customer";

mongoose.connect('mongodb+srv://NEON:'+ 'hzDn3tAbXyoS7GPe' +'@nodeproject1.73asn.mongodb.net/mstest?retryWrites=true&w=majority',({
    useNewUrlParser: true,
    useUnifiedTopology: true
}), () => {
    console.log("Connected to Database");
});
app.use(express.json());

app.get(urlPrefix + '/', (req, res) => {
    Customer.find()
    .select('name age address')
    .then((docs) => {
        res.json({
            message: "List of Customers",
            books: docs
        })
    })
    .catch((err) => { error: err });
});

app.get(urlPrefix + '/:id', (req, res) => {
    Customer.findById({ _id: req.params.id })
    .select('name age address')
    .then((customer) => { res.json(customer); })
    .catch((err) => { res.json({ error: err }) });
});

app.post(urlPrefix, (req, res) => {
    const customer = new Customer({
        name: req.body.name,
        age: req.body.age,
        address: req.body.address
    });
    customer.save()
    .then((response) => { res.json({ message: "Registered Customer " + response.name }) })
    .catch((error) => { error: error });
});

app.delete(urlPrefix + '/:id', (req, res) => {
    Customer.deleteOne({ _id: req.params.id })
    .then(res.json({ message: "Removed the Customer" }))
    .catch((err) => { res.json({ error: err }) });
});

app.delete(urlPrefix, (req, res) => {
    Customer.deleteMany()
    .then(res.json({ message: "Removed all Customers" }))
    .catch((err) => { res.json({ error: err }) });
});

app.listen(port, () => {
    console.log('Customer service running on port : ' + port);
});