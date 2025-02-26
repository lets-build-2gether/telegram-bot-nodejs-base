require("dotenv").config();

const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 4040;
const { handler } = require("./controller");

const app = express();
app.use(cors());
app.use(express.json());

app.post("*", async (req, res) => {
  console.log(req.body);
  res.send(await handler(req, "POST"));
});
app.get("*", async (req, res) => {
  res.send(await handler(req, "GET"));
});

app.listen(PORT, function (err) {
  if (err) console.log(err);
  console.log("Server listening on PORT", PORT);
});
