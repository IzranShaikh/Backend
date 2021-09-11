const express = require('express');
const app = express();
const port = 6001;
const mongoose = require('mongoose');
const Books = require('./books-model');
const urlPrefix = "/books";

mongoose.connect('mongodb+srv://NEON:'+ 'hzDn3tAbXyoS7GPe' +'@nodeproject1.73asn.mongodb.net/mstest?retryWrites=true&w=majority',({
    useNewUrlParser: true,
    useUnifiedTopology: true
}), () => {
    console.log("Connected to Database");
});
app.use(express.json());

app.get(urlPrefix + '/', (req, res) => {
    Books.find()
    .select('title author pages publisher')
    .exec()
    .then((docs) => {
        res.json({
            message: "All available books",
            books: docs
        })
    })
    .catch((err) => { error: err });
});

app.get(urlPrefix + '/:bookId', (req, res) => {
    Books.findById({ _id: req.params.bookId })
    .select('title author pages publisher')
    .then((book) => { res.json(book); })
    .catch((err) => { res.json({ error: err }) });
});

app.post(urlPrefix + '/new', (req, res) => {
    const newBook = new Books({
        title: req.body.title,
        author: req.body.author,
        pages: req.body.pages,
        publisher: req.body.publisher
    });
    newBook.save()
    .then((doc) => res.json({ message : "New Book Created" }))
    .catch((err) => res.json({ error: err }));
});

app.delete(urlPrefix + '/:bookId', (req, res) => {
    Books.deleteOne({ _id: req.params.bookId })
    .then(res.json({ message: "Removed the book" }))
    .catch((err) => { res.json({ error: err }) });
});

app.delete(urlPrefix, (req, res) => {
    Books.deleteMany()
    .then(res.json({ message: "Removed all books" }))
    .catch((err) => { res.json({ error: err }) });
});

app.listen(port, () => {
    console.log('Books service running on port : ' + port);
});