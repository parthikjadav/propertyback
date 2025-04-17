const express = require("express");
const inquiryController = require("../controllers/inquiry.controller");
const { validate, inquirySchema, updateInquirySchema } = require("../validation");
const { authenticate } = require("../auth");
const route = express.Router()

route.get("/", inquiryController.getMessages)
route.patch("/:id", validate(updateInquirySchema), inquiryController.updateMessage)
route.post("/send-message", validate(inquirySchema), inquiryController.sendMessage)
route.delete("/:id", inquiryController.deleteMessage)

module.exports = route