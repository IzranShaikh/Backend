// const multer = require('multer');


// //Multer Config
// const MIMETYPEMAP = {
//     'image/png':'png',
//     'image/jpeg':'jpg',
//     'image/jpg':'jpg'
// };

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const isValid = MIMETYPEMAP[file.mimetype];
//         let error = isValid ? null : new Error("Invalid mimetype");
//         cb(error, "images"); //for some reason this path is relative to the SERVER.JS file thats why such path
//     },
//     filename: (req, file, cb) => {
//         const name = file.originalname.toLowerCase().split(' ').join('-');
//         const ext = MIMETYPEMAP[file.mimetype];
//         cb(null, name + '-' + String(Math.random() * (name.length + 1)).split('.').join('-') + '.' + ext);
//     }
// });

// module.exports = multer({ storage: storage }).single("imageUrl");