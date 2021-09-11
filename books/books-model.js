const mongoose = require('mongoose');

const BooksSchema = mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    pages: { type: Number, default: 1 },
    publisher: { type: String, required: false }
});

module.exports = mongoose.model("Books", BooksSchema);