const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./config/database");
const router = require("./routes/router");
const { signup, login } = require("./controllers/authController");

const app = express();

require("dotenv").config();

app.use(cors());
app.use(bodyParser.json());

// Login and Signup routes
app.post("/api/register", signup);
app.post("/api/login", login);

// Routes
app.use("/api", router);

console.log("------ROUTE--------");
// router.stack.forEach(layer => {

//     // console.log(layer.route.stack[0].method+" | "+layer.route.path);
// });
console.log("-------------------");
// Test de connexion à la DB
sequelize
  .sync()
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get("/test", (req, res) => {
    res.status(200).send("Test OK");
});

module.exports = app;
