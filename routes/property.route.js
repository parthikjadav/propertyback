const express = require("express");
const { upload } = require("../upload/multer");
const propertyController = require("../controllers/property.controller");
const { authenticate, authorize } = require("../auth");
const { validate, updatePropertySchema, propertySchema, visibilitySchema } = require("../validation");
const { ROLES } = require("../constants");

const route = express.Router()

route.patch("/:id", upload.single('image'), validate(updatePropertySchema), propertyController.updateProperty)
route.post("/", upload.single('image'), validate(propertySchema), propertyController.addProperty)
route.post("/visibility", validate(visibilitySchema), propertyController.changeVisibility)
route.delete("/:id", propertyController.deleteProperty)

route.get("/all", propertyController.getAllProperties)
route.get("/get/:id", propertyController.getPropertyById)

module.exports = route