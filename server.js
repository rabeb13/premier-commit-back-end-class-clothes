// 1 require express
const express = require("express");
const cors = require("cors");              // ✅ AJOUT

// 2 create instance of express
const app = express();

// 5 require dotenv
require("dotenv").config();

// 6 connect to database
const connectDB = require("./config/connectDB");
connectDB();

// middlewares globaux
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",  // CRA
      "http://localhost:5173",  // Vite
    ],
    credentials: false,
  })
);

// routes
app.use("/api/user", require("./routes/user"));
app.use("/api/auth", require("./routes/auth"));       
app.use("/api/products", require("./routes/product"));
app.use("/api/cart", require("./routes/cart"));
// app.use("/api/orders", require("./routes/orders"));

// ✅ Cloudinary upload route
const cloudinary = require("cloudinary").v2;
const multer = require("multer");

// config cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// config multer (stockage mémoire)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// route upload
app.post("/api/upload", upload.single("image"), async (req, res) => {
  try {
    cloudinary.uploader.upload_stream(
      { folder: "my_app" },
      (error, result) => {
        if (error) return res.status(500).json({ error });
        res.json({ 
          url: result.secure_url,
          public_id: result.public_id
        });
      }
    ).end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// health check (pour tester vite dans le navigateur)
app.get("/api/health", (req, res) => res.json({ ok: true }));

// 3 create PORT (avec fallback)
const PORT = process.env.PORT || 5901;

// 4 start server
app.listen(PORT, (err) => {
  if (err) console.error(err);
  else console.log(`Server is running on port ${PORT}..`);
});
