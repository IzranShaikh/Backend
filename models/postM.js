const mongoose = require('mongoose');
const User = require('../models/userM');

const postSchema = mongoose.Schema({
    title : { type: String, required: true },
    content : { type: String, default: ""},
    visible : { type: String, default: "public" },
    creator : { type: mongoose.Schema.Types.ObjectId, ref: User, required: true },
});

module.exports = mongoose.model('Post', postSchema);