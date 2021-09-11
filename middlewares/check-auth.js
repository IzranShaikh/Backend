const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_TOKEN_SECRET)
        req.userData = { email: decodedToken.email, _id: decodedToken._id };
        next();
    } catch (err) {
        res.status(401).json({message: "You are not Authenticated, Please Login", error: err});
    }
};