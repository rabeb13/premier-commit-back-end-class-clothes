// 1. Require modules
const express = require("express");
const cors = require("cors");
const path = require("path"); // pour servir le frontend
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// 2. Connect DB
const connectDB = require("./config/connectDB");
connectDB();

// 3. Create Express app
const app = express();

// 4. Middlewares
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://premier-commit-front-end-project.onrender.com",
    ],
    credentials: false,
  })
);

// 5. Routes API
app.use("/api/user", require("./routes/user"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/product"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/orders", require("./routes/orders"));

// 6. Cloudinary setup
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 7. Upload route
app.post("/api/upload", upload.single("image"), async (req, res) => {
  try {
    cloudinary.uploader.upload_stream(
      { folder: "my_app" },
      (error, result) => {
        if (error) return res.status(500).json({ error });
        res.json({ url: result.secure_url, public_id: result.public_id });
      }
    ).end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Health check
app.get("/api/health", (req, res) => res.json({ ok: true }));


// 10. PORT
const PORT = process.env.PORT || 5901;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
