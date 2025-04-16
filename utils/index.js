const { default: mongoose } = require("mongoose")

const isInvalidObjectIds = (ids) => {
    const isInvalid = ids.filter((id) => {
        return !mongoose.Types.ObjectId.isValid(id)
    })
    return isInvalid.length >= 1 ? true : false
}

module.exports = { isInvalidObjectIds }