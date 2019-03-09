const express = require("express");

const app = express();

app.get("/init", (req, res) => {
  res.send("Init Backend");
});

app.listen(process.env.PORT || 8080);
dasdsdasds;
