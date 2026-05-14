const express = require("express");
const cors = require("cors");
const authRoutes = require("./Routes/authRoutes");
const ticketRoutes = require("./Routes/ticketRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);

module.exports = app;