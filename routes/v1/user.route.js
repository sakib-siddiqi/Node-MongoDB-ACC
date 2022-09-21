const express = require("express");
const userController = require("../../controllers/user.controller");
const userValidation = require("../../middlewares/userValidation");
const userRoute = express.Router();

/**
 * @api {get} all the users.
 * @apidescription all the user.
 * @apiparams {Number 1-100} {limit=10} limit result.
 * @apisuccess all the users.
 */

userRoute.get("/all", userController.allUser);
userRoute.get("/random", userController.randomUser);
userRoute.get("/:id", userController.userById);
userRoute.post("/save", userController.saveUser);
userRoute.put("/update/:id",userValidation, userController.update);
userRoute.put("/bulk-update", userController.bulkUpdate);
userRoute.delete("/delete/:id",userValidation, userController.delete);

module.exports = userRoute;
