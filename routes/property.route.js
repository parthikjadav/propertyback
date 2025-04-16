const express = require("express");
const {upload} = require("../upload/multer");
const propertyController = require("../controllers/property.controller");
const { authenticate, authorize } = require("../auth");
const { valiate, updatePropertySchema, propertySchema, visiblitySchema } = require("../validation");
const { OWNER_AND_ADMIN_ROLES } = require("../constants");

const route = express.Router()

route.patch("/:id",authenticate,authorize(OWNER_AND_ADMIN_ROLES),upload.single('image'),valiate(updatePropertySchema),propertyController.updateProperty)
route.post("/",authenticate,authorize(OWNER_AND_ADMIN_ROLES),upload.single('image'),valiate(propertySchema),propertyController.addProperty)
route.post("/visiblity",authenticate,authorize(OWNER_AND_ADMIN_ROLES),valiate(visiblitySchema),propertyController.changeVisiblity)
route.delete("/:id",authenticate,authorize(OWNER_AND_ADMIN_ROLES),propertyController.deleteProperty)

route.get("/all",authenticate,authorize(OWNER_AND_ADMIN_ROLES),propertyController.getAllProperties)
route.get("/get/:id",authenticate,authorize(OWNER_AND_ADMIN_ROLES),propertyController.getPropertyById)

module.exports = route