const express = require("express");
const userController = require("../controllers/user.controller");
const { validate, userSignUpSchema, userSignInSchema } = require("../validation");
const { authenticate, authorize } = require("../auth");
const authController = require("../controllers/auth.controller");

const route = express.Router()

route.get("/", authenticate, userController.getUser)
// route.get("/all",authenticate,authorize(['admin']),userController.getAllUsers)
route.post("/sign-out", authController.signOut)
route.post("/sign-up", validate(userSignUpSchema), authController.signUp)
route.post("/sign-in", validate(userSignInSchema), authController.signIn)

module.exports = route