// middleware/multer.js
const multer = require("multer");

// stockage en mémoire
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload;
