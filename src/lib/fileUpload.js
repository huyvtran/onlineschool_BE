const multer = require('multer');

const fileStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'E://videos');
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
});
exports.upload = multer({ storage: fileStorage });