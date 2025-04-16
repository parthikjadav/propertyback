const express = require("express");
const userController = require("../controllers/user.controller");
const { authenticate, authorize } = require("../auth");
const { valiate, updateUserSchema } = require("../validation");

const route = express.Router()

route.get("/",authenticate,userController.getUser)
route.get("/get/:id",authenticate,userController.getUserById)
route.get("/all",authenticate,authorize(['admin']),userController.getAllUsers)

route.patch("/:id",authenticate,valiate(updateUserSchema),userController.updateUser)
route.delete("/:id",authenticate,authorize(['admin']),userController.deleteUser)

route.post("/verify-email",authenticate,userController.verifyEmail)
route.post("/resend-otp-email",authenticate,userController.sendEmailOtp)

module.exports = route
