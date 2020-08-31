const express = require("express");
const cors = require("cors");
const nlpRoute = require("./nlp/query-builder");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/nlp", nlpRoute);

app.listen(process.env.PORT || 5001, () =>
  console.log("Started server on port 5001")
);
