const express = require("express");
const userController = require("../controllers/user.controller");
const { authenticate, authorize } = require("../auth");
const { validate, updateUserSchema, resetPasswordSchema, validateAsync } = require("../validation");

const route = express.Router()

route.get("/", userController.getUser)
route.get("/get/:id", userController.getUserById)
route.get("/all", authorize(['admin']), userController.getAllUsers)

route.patch("/:id", validate(updateUserSchema), userController.updateUser)
route.delete("/:id", authorize(['admin']), userController.deleteUser)

route.post("/send-reset-password-email",userController.sendResetPasswordEmail)
route.post("/reset-password",validateAsync(resetPasswordSchema),userController.resetPassword)
route.post("/verify-email", userController.verifyEmail)
route.post("/resend-otp-email", userController.sendEmailOtp)

module.exports = route
