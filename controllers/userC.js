const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userM');

require('mongoose').connect("mongodb+srv://NEON:" + process.env.DB_PASS + "@nodeproject1.73asn.mongodb.net/storeshare?retryWrites=true&w=majority", { useUnifiedTopology: true, useNewUrlParser: true })
.then(() => {
    console.log("[+] Connected to Database");
})
.catch((err) => {
    console.log("[-] Failed to connect to Database"+err);
});

exports.signup = (req, res) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            username: req.body.username,
            password: hash,
        });
        user.save()
        .then(result => {
            res.status(201).json({ registereduser: result });
        })
        .catch(() => {
            res.status(500).json({ message: "Email already taken" });
        })
    })
}

exports.login = (req, res) => {
    User.findOne({ email: req.body.email })
    .then(user => {
        if (!user) {
            return res.status(404).json({ message: 'Authentication Failed : Invalid Email or Password' });
        }
        bcrypt.compare(req.body.password, user.password)
        .then(result => {
            if (!result) {
                return res.status(404).json({ message: 'Authentication Failed : Invalid Email or Password' });
            }
            const token = jwt.sign({ email: user.email, _id: user._id, username: user.username }, process.env.JWT_TOKEN_SECRET, {
                expiresIn:'1h'
            });
            console.log(user.username);
            res.status(200).json({
                token: token,
                _id: user._id,
                username: user.username,
                expiresIn: 3600
            })
        })
    })
}