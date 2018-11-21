const mongoose = require('mongoose')
const { Schema } = mongoose
const bcrypt = require('bcryptjs')


const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    password: String,
    phone: String,
    isVerified: { type: Boolean, default: false},
}, { timestamps: true })

// Encrypt password (salt and hash) pre-save hook
userSchema.pre('save', async function(next) {
    try {
        this.password = await bcrypt.hash(this.password, 10)
        next()
    }
    catch(err) {
        return next(err)
    }
})

// Method to decrypt and compare attempted password to stored encrypted user password
userSchema.methods.comparePassword = async function(password) {
    try {
        const isMatch = await bcrypt.compare(password, this.password)
        return isMatch
    }
    catch(err) {
        return err
    }
}

// Model class
const User = mongoose.model('users', userSchema)

// Model export
module.exports = User


//mongoose.model('users', userSchema)
