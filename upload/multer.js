const path = require("path")
const fs = require("fs")

const multer = require("multer");

const storage = multer.diskStorage({
    destination: './uploads/', // Folder to save uploaded files
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // e.g. 1683950591234.jpg
    }
});

const removeFileIfExists = (path) => {
    fs.stat(path, function (err, stats) {
        if (err) {
            return console.error(err);
        }

        fs.unlink(path, function (err) {
            if (err) return console.log(err);
        });
    })
};

const upload = multer({ storage })

module.exports = {upload,removeFileIfExists}