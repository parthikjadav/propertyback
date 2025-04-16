const Inquirey = require("../models/inquirey.model");
const Property = require("../models/property.model");
const { isInvalidObjectIds } = require("../utils")

const inquireyController = {
    sendMessage: async (req, res) => {
        try {
            const { from, to, propertyId, message } = req.body
            if (isInvalidObjectIds([from, to, propertyId])) {
                return res.status(400).json({ message: "invalid ids" })
            }
            const newMsg = await Inquirey.create({
                propertyId,
                from,
                to,
                message
            });

            if (!newMsg) {
                return res.status(400).json({ message: "failed to send message" })
            }

            res.status(201).json({ message: 'message sent successfully', newMsg })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
    getMessages: async (req, res) => {
        try {
            const { propertyId, from, to } = req.query

            if (isInvalidObjectIds([propertyId, from, to])) {
                return res.status(400).json({ message: "invalid object id" })
            }

            const property = await Property.findById(propertyId)

            if (!property) {
                return res.status(400).json({ message: "property not found" })
            }

            const { ownerId } = property
            console.log(ownerId, 'owner id');

            const chat = await Inquirey.find({ $or: [{ from, to }, { from: to, to: from }] }).populate("from").populate("to").populate("propertyId")
            console.log(chat, 'chat');

            if (chat.length <= 0) {
                return res.status(400).json({ message: "chat not found" })
            }

            res.status(200).json({ message: "chat fetched successfully", chat })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
    updateMessage: async (req, res) => {
        try {
            const { id } = req.params
            const { message } = req.body

            if (isInvalidObjectIds([id])) {
                return res.status(400).json({ message: "invalid object id" })
            }

            if(req.user.role!=='admin'){
                const message = await Inquirey.findById(id)

                if(message.from!==req.user._id){
                    return res.status(400).json({ message: "you does not have permission to update this message" })
                }
            }

            const updatedMessage = await Inquirey.findByIdAndUpdate(id,{
                message
            },{new:true})

            if (!updatedMessage) {
                return res.status(400).json({ message: "failed to update message" })
            }

            res.status(200).json({message: "message updated successfully",data:updatedMessage.message})
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
    deleteMessage: async (req,res) =>{
        try {
            const {id} = req.params
            if (isInvalidObjectIds([id])) {
                return res.status(400).json({ message: "invalid object id" })
            }

            if(req.user.role!=='admin'){
                const message = await Inquirey.findById(id)

                if(message.from!==req.user._id){
                    return res.status(400).json({ message: "you does not have permission to update this message" })
                }
            }

            const deletedMessage = await Inquirey.findByIdAndUpdate(id)

            if (!deletedMessage) {
                return res.status(400).json({ message: "failed to delete message" })
            }

            res.status(200).json({message: "message deleted successfully"})

        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
}

module.exports = inquireyController