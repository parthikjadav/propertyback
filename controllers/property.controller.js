const expressAsyncHandler = require("express-async-handler")
const uploadToCloudinary = require("../upload/cloudinary")
const { removefileIfExists } = require("../upload/multer")
const Property = require("../models/property.model")
const { default: mongoose } = require("mongoose")
const { isInvalidObjectIds } = require("../utils")

const propertyController = {
    addProperty: expressAsyncHandler(async (req, res) => {
        if (!req.file) {
            return res.status(400).json({ message: "image is required" })
        }
        const { ownerId, title, description, location, address, price } = req.body
        const cloudeImage = await uploadToCloudinary(req.file.path)
        if (!cloudeImage) {
            return res.status(400).json({ message: "failed to upload image" })
        }
        removefileIfExists(req.file.path)
        const property = await Property.create({
            ownerId,
            title,
            description,
            image: cloudeImage.url,
            location,
            address,
            price
        })

        if (!property) return res.status(500).json({ message: "failed to create property" })

        res.status(200).json({ message: "property created successfully", property })
    }),
    updateProperty: expressAsyncHandler(async (req, res) => {
        const { title, description, location, address, price } = req.body

        const { id } = req.params

        if (isInvalidObjectIds([id])) {
            return res.status(400).json({ message: "Invalid user ID" })
        }
        const property = await Property.findById(id)

        if (!property) {
            return res.status(400).json({ message: "id is invalid property not found" })
        }

        const isOwner = req.user._id.toString() === property.ownerId.toString()
        if (!isOwner) {
            return res.status(400).json({ message: "you does not have permission to update the property" })
        }
        let cloudeImage;
        if (req.file) {
            cloudeImage = await uploadToCloudinary(req.file.path)
            if (!cloudeImage) {
                return res.status(400).json({ message: "failed to upload image" })
            }
            removefileIfExists(req.file.path)
            req.body.image = cloudeImage.url
        }

        const newProperty = await Property.findByIdAndUpdate(id, {
            title,
            description,
            price,
            location,
            address,
            image: cloudeImage ? cloudeImage.url : undefined
        }, { new: true })

        if (!newProperty) {
            return res.status(400).json({ message: "failed to update property" })
        }

        res.status(200).json({ message: "updated property successfully", newProperty })
    }),
    deleteProperty: expressAsyncHandler(async (req, res) => {
        const { id } = req.params

        if (isInvalidObjectIds([id])) {
            return res.status(400).json({ message: "Invalid user ID" })
        }

        const property = await Property.findById(id)
        if (!property) {
            return res.status(400).json({ message: "id is invalid property not found" })
        }

        const isOwner = req.user._id.toString() === property.ownerId.toString()
        if (!isOwner) {
            return res.status(400).json({ message: "you does not have permission to update the property" })
        }

        const deletedProperty = await Property.findByIdAndDelete(id)
        if (!deletedProperty) {
            return res.status(400).json({ message: "failed to delete property" })
        }

        res.status(200).json({ message: "deleted property successfully", property })
    }),
    getAllProperties: expressAsyncHandler(async (req, res) => {
        try {
            const { role, _id } = req.user
            const { page, limit } = req.query
            const options = {
                page: page || 1,
                limit: limit || 10,
                customLabels: {},
            };
            let paginatedResult;
            await Property.paginate({}, options, function (err, result) {
                if (err) {
                    res.status(500).json({ message: "error generating pagination" })
                }
                paginatedResult = result
            })
            if (paginatedResult.docs.length <= 0) {
                return res.status(400).json({ message: "docs not found ", paginatedResult })
            }
            if (role === "owner") {
                console.log(paginatedResult,"res");
                
                const filteredResult = paginatedResult.docs.filter((val) => {
                    return val.ownerId.toString() === _id.toString()
                })
                console.log(filteredResult,'filter');
                
                if (filteredResult.length <= 0) {
                    return res.status(400).json({ message: "no propertys found" })
                }
                paginatedResult.docs = filteredResult
                return res.status(200).json({ message: "successfully fetched all propertys of owner", paginatedResult })
            }
            if (role === "admin") {
                return res.status(200).json({ message: "successfully fetched all propertys by admin", paginatedResult })
            }
        } catch (error) {
            return res.status(400).json({ message: error.message })
        }
    }),
    getPropertyById: expressAsyncHandler(async (req, res) => {
        try {
            const { id } = req.params

            if (isInvalidObjectIds([id])) {
                return res.status(400).json({ message: "Invalid user ID" })
            }
            if (req.user.role !== 'admin') {
                const property = await Property.findById(id)
                if (!property) {
                    return res.status(400).json({ message: "id is invalid property not found" })
                }

                const isOwner = req.user._id.toString() === property.ownerId.toString()
                if (!isOwner) {
                    return res.status(400).json({ message: "you does not have permission to get property" })
                }
            }
            const resProperty = await Property.findById(id)

            if (!resProperty) {
                return res.status(400).json({ message: "failed to fetch property" })
            }

            return res.status(200).json({ message: "successfully fetched property", resProperty })
        } catch (error) {
            return res.status(500).json({ message: "failed to fetch property" })
        }
    }),
    changeVisiblity: expressAsyncHandler(async (req, res) => {
        try {
            const { active, id } = req.body

            if (active === undefined) {
                return res.status(400).json({ message: "active field is required" })
            }

            const property = await Property.findById(id)
            if (!property) {
                return res.status(400).json({ message: "id is invalid property not found" })
            }

            const isOwner = req.user._id.toString() === property.ownerId.toString()
            if (!isOwner) {
                return res.status(400).json({ message: "you does not have permission to update the property" })
            }

            const resProperty = await Property.findByIdAndUpdate(id, {
                active
            }, { new: true })

            if (!resProperty) {
                return res.status(400).json({ message: "failed to update visiblity" })
            }

            res.status(200).json({ message: "updated visiblity successfully", resProperty })

        } catch (error) {
            return res.status(400).json({ message: error.message })
        }
    })
}

module.exports = propertyController