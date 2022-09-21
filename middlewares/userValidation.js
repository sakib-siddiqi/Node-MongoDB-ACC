const fs = require("fs");

const DB = "./data.json";

module.exports = (req, res, next) => {
  const id = +req.params.id;
  fs.readFile(DB, (err, data) => {
    if (err) {
      res.json({
        code: 502,
        message: "Database error",
      });
    }
    const users = JSON.parse(data) || [];
    const item = users?.find((ele) => +ele.id === id);
    if (!item) {
      res.json({
        code: 404,
        message: "User not found",
      });
    } else {
      next();
    }
  });
};
