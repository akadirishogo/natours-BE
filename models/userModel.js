const crypto = require('crypto')
const mongoose = require('mongoose')
const validator = require('validator');
const bcrypt = require('bcryptjs')

// name, email, photo, password, passwordConfirm

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name']
    },

    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },

    photo: {  
        type: String,
        default: 'default.jpg'
    },

    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },

    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    },

    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        // This only works only on CREATE & SAVE!
        validate: {
            validator: function(el) {
               return el === this.password
            },
            message: 'Passwords are not the same'
        }
    },

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
})

//  userSchema.pre('save', async function(next) {
//     // To  ensure this runs only when password is modified
//     if (!this.isModified('password')) return next()

//     // Hash the user's password with cost of 12
//     this.password = await bcrypt.hash(this.password, 12)

//     // Delete the passwordConfirm field
//     this.passwordConfirm = undefined;

//     next()
// })

// userSchema.pre('save', function(next) {
//     if (!this.isModified('password') || this.isNew) return next();

//     this.passwordChangedAt = Date.now() - 1000
// }) 

userSchema.pre(/^find/, function(next) {
    // this points to the current query
    this.find({ active: {$ne: false} })
    next()
})

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if  (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)

        return JWTTimestamp < changedTimestamp
    }

    return false
}

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex')
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000
    return resetToken
}
 
const User = mongoose.model('User', userSchema)

module.exports = User;