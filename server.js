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
app.use("/api/products", require("./routes/product"));
app.use("/api/cart", require("./routes/cart"));

// health check (pour tester vite dans le navigateur)
app.get("/api/health", (req, res) => res.json({ ok: true }));

// 3 create PORT (avec fallback)
const PORT = process.env.PORT || 5901;

// 4 start server
app.listen(PORT, (err) => {
  if (err) console.error(err);
  else console.log(`Server is running on port ${PORT}..`);
});
