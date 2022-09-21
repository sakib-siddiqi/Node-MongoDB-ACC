const express = require("express");
const fs = require("fs");
const userRoute = require("./routes/v1/user.route");

const app = express();

const PORT = process.env.PORT || 8000;
app.use(express.json());
app.use("/user", userRoute);
app.all("*", (req, res) => {
  res.status(404).json({
    code: 404,
    message: "route not found.",
  });
});
app.listen(PORT, () => {
  console.log(PORT, "LISTENING");
});
