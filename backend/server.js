require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
var mainRoutes = require("./routes/main");

app.use(cors());
app.use(express.json());

app.use("/chat", mainRoutes); // Use the chat routes

app.listen(3000, () => console.log("Backend running on port 3000"));
