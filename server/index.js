import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "you got /" });
});

app.listen(3001, () => {
  console.log("listening");
});
