const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const usersRoutes = require("./routes/userRoutes");
const organizationRoutes = require("./routes/organizationRoutes");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/users", usersRoutes);
app.use("/api/organizations", organizationRoutes);

app.get("/", (req, res) => {
  res.send("Ruta raiz del Backend");
});

app.get("/test", (req, res) => {
  res.send("Ruta TEST");
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send(err.stack);
});

module.exports = app;
