const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Please provide username'],
        maxlength: 50,
        minlength: 4
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        // regex for email validation
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide a valid email'],
        unique: true  // it's not a validator, it's just a property
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// middleware

// before saving the user, we want to hash the password

UserSchema.pre('save', async function () {
    //     // "this" refers to the current user
    const salt = await bcrypt.genSalt(10);
    // if (!this.password) throw new Error('Password is required')
    this.password = await bcrypt.hash(this.password, salt);
})

// by not creating arrow function we are making sure that "this" refers to the current user
// refer for more : https://www.codementor.io/@dariogarciamoya/understanding-this-in-javascript-with-arrow-functions-gcpjwfyuc

UserSchema.methods.createJWT = function () {
    return jwt.sign({ id: this._id, name: this.name }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME })
}

UserSchema.methods.comparePasswords = async function (password) {
    return await bcrypt.compare(password, this.password);
}

module.exports = mongoose.model('User', UserSchema)