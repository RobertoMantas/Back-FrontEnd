const express = require("express");

const app = express();

app
  .get("/init", (req, res) => {
    res.send("Init Backend");
  })
  .on("error", _ => console.log("Error: Al levantar servidor"));
app.listen(process.env.PORT || 8080);
