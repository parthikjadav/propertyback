const express = require("express");
const inquireyController = require("../controllers/inquirey.controller");
const { valiate, inquirySchema, updateInquirySchema } = require("../validation");
const { authenticate } = require("../auth");
const route = express.Router()

route.get("/",authenticate,inquireyController.getMessages)
route.patch("/:id",authenticate,valiate(updateInquirySchema),inquireyController.updateMessage)
route.post("/send-message",authenticate,valiate(inquirySchema),inquireyController.sendMessage)
route.delete("/:id",authenticate,inquireyController.deleteMessage)

module.exports = route