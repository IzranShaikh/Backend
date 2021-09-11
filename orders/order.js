const express = require('express');
const app = express();
const axios = require('axios');
const port = 6003;
const mongoose = require('mongoose');
const Order = require('./order-model');
const urlPrefix = "/order";

mongoose.connect('mongodb+srv://NEON:'+ 'hzDn3tAbXyoS7GPe' +'@nodeproject1.73asn.mongodb.net/mstest?retryWrites=true&w=majority',({
    useNewUrlParser: true,
    useUnifiedTopology: true
}), () => {
    console.log("Connected to Database");
});
app.use(express.json());

app.get(urlPrefix + '/', (req, res) => {
    Order.find()
    .select('customerID bookID recieveDate returnDate')
    .then((docs) => {
        res.json({
            message: "All Placed Orders",
            books: docs
        })
    })
    .catch((err) => { error: err });
});

app.get(urlPrefix + '/:id', (req, res) => {
    Order.findById({ _id: req.params.id })
        .select('customerID bookID recieveDate returnDate')
        .then((order_detail) => {
            axios.get("http://localhost:6002/customer/" + order_detail.customerID)
            .then((response) => {
                const orderDet = { orderID : order_detail._id, orderedBy: response.data.name, orderedBook: '', orderedOn: order_detail.recieveDate, returnBy: order_detail.returnDate };
                axios.get("http://localhost:6001/books/" + order_detail.bookID)
                .then((response) => {
                    orderDet.orderedBook = response.data.title;
                    res.json(orderDet);
                });
            }).catch((error) => {res.send("Something went wrong : " + error)});
        })
        .catch((err) => { res.json({ error: err }) });
});

app.post(urlPrefix, (req, res) => {
    const order = new Order({
        customerID : mongoose.Types.ObjectId(req.body.customerID),
        bookID : mongoose.Types.ObjectId(req.body.bookID),
        recieveDate : req.body.recieveDate,
        returnDate : req.body.returnDate
    });
    order.save()
    .then((order_detail) => { res.json({ order_detail: order_detail}) })
    .catch((err) => { res.json({ error: err }) })
});

app.listen(port, () => {
    console.log("Orders service running on port : " + port);
});