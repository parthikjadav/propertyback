const expressAsyncHandler = require("express-async-handler")
const uploadToCloudinary = require("../upload/cloudinary")
const { removeFileIfExists } = require("../upload/multer")
const Property = require("../models/property.model")
const { isInvalidObjectIds } = require("../utils")

const propertyController = {
    addProperty: expressAsyncHandler(async (req, res) => {
        if (!req.file) {
            return res.status(400).json({ message: "image is required" })
        }
        const { ownerId, title, description, location, address, price } = req.body
        const cloudImage = await uploadToCloudinary(req.file.path)
        if (!cloudImage) {
            return res.status(400).json({ message: "failed to upload image" })
        }
        removeFileIfExists(req.file.path)
        const property = await Property.create({
            ownerId,
            title,
            description,
            image: cloudImage.url,
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
        if (req.user.role !== 'admin') {
            const isOwner = req.user._id.toString() === property.ownerId.toString()
            if (!isOwner) {
                return res.status(400).json({ message: "you does not have permission to update the property" })
            }
        }
        let cloudImage;
        if (req.file) {
            cloudImage = await uploadToCloudinary(req.file.path)
            if (!cloudImage) {
                return res.status(400).json({ message: "failed to upload image" })
            }
            removeFileIfExists(req.file.path)
            req.body.image = cloudImage.url
        }

        const newProperty = await Property.findByIdAndUpdate(id, {
            title,
            description,
            price,
            location,
            address,
            image: cloudImage ? cloudImage.url : undefined
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
        if (req.user.role !== 'admin') {
            const isOwner = req.user._id.toString() === property.ownerId.toString()
            if (!isOwner) {
                return res.status(400).json({ message: "you does not have permission to update the property" })
            }
        }
        const deletedProperty = await Property.findByIdAndDelete(id)
        if (!deletedProperty) {
            return res.status(400).json({ message: "failed to delete property" })
        }

        res.status(200).json({ message: "deleted property successfully", property })
    }),
    getAllProperties: expressAsyncHandler(async (req, res) => {
        try {
            let { page = 1, limit = 10, search = "", sortBy = "asc", priceMin = 0, priceMax = Infinity } = req.query;

            page = parseInt(page);
            limit = parseInt(limit);

            const sortOrder = sortBy.toLowerCase() === "desc" ? -1 : 1;

            const regex = new RegExp(search, "i");

            const filter = {
                $or: [
                    { title: { $regex: regex } },
                    { description: { $regex: regex } },
                    { address: { $regex: regex } }
                ],
                price: { $gte: priceMin, $lte: priceMax }
            };

            const startIndex = (page - 1) * limit;

            const [properties, totalCount] = await Promise.all([
                Property.find(filter).skip(startIndex).limit(limit).sort({ title: sortOrder }).populate("ownerId"),
                Property.countDocuments(filter)
            ]);

            const totalPages = Math.ceil(totalCount / limit);

            if (!properties.length) {
                return res.status(404).json({ message: "No properties found" });
            }

            res.status(200).json({
                page,
                limit,
                totalPages,
                totalCount,
                properties
            });
        } catch (error) {
            return res.status(400).json({ message: error.message });
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
    changeVisibility: expressAsyncHandler(async (req, res) => {
        try {
            const { active, id } = req.body

            if (active === undefined) {
                return res.status(400).json({ message: "active field is required" })
            }

            const property = await Property.findById(id)
            if (!property) {
                return res.status(400).json({ message: "id is invalid property not found" })
            }
            if (req.user.role !== 'admin') {
                const isOwner = req.user._id.toString() === property.ownerId.toString()
                if (!isOwner) {
                    return res.status(400).json({ message: "you does not have permission to update the property" })
                }
            }
            const resProperty = await Property.findByIdAndUpdate(id, {
                active
            }, { new: true })

            if (!resProperty) {
                return res.status(400).json({ message: "failed to update visibility" })
            }

            res.status(200).json({ message: "updated visibility successfully", resProperty })

        } catch (error) {
            return res.status(400).json({ message: error.message })
        }
    }),
    getAllPropertiesOfOwner: expressAsyncHandler(async (req, res) => {
        try {
            let { page = 1, limit = 10, search = "", sortBy = "asc", priceMin = 0, priceMax = Infinity } = req.query;
            let { _id } = req.user
            page = parseInt(page);
            limit = parseInt(limit);

            const sortOrder = sortBy.toLowerCase() === "desc" ? -1 : 1;

            const regex = new RegExp(search, "i");
            
            let filter = {
                $or: [
                    { title: { $regex: regex } },
                    { description: { $regex: regex } },
                    { address: { $regex: regex } }
                ],
                price: { $gte: priceMin, $lte: priceMax }
            };

            if(req.user.role === 'owner'){
                filter.ownerId = _id.toString() 
            }

            const startIndex = (page - 1) * limit;

            const [properties, totalCount] = await Promise.all([
                Property.find(filter).skip(startIndex).limit(limit).sort({ title: sortOrder }).populate("ownerId"),
                Property.countDocuments(filter)
            ]);

            const totalPages = Math.ceil(totalCount / limit);

            if (!properties.length) {
                return res.status(404).json({ message: "No properties found" });
            }

            res.status(200).json({
                page,
                limit,
                totalPages,
                totalCount,
                properties
            });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    })
}

module.exports = propertyController