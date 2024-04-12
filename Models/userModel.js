const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Enter your name.']
    },
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email']

    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minLength: 8,
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'

    },
    confirmPassword: {
        type: String,
        required: [true, 'Please enter a password'],
        validate: {
            validator: function (val) {
                return val === this.password
            },
            message: 'Password and Confirm Password does not match!!'
        }

    },
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    // Only available if the user changed the password otherwise it won't be available for the user document
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date


})

userSchema.pre('save', async function (next) {

    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined
    next()

})


userSchema.pre(/^find/, function (next) {
    //this keyword in the function points to current query
    this.find({ active: { $ne: true } })

    next()

})

userSchema.methods.comparePasswordInDB = async function (pass, passInDB) {

    return await bcrypt.compare(pass, passInDB);
}

userSchema.methods.isPasswordChanged = async function (JWTTimestamp) {

    if (this.passwordChangedAt) {
        const passwordChangeTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10) //base 10

        console.log(passwordChangeTimestamp, JWTTimestamp)

        return JWTTimestamp < passwordChangeTimestamp;

    } else return false
}

userSchema.methods.createResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;

}


const User = new mongoose.model('User', userSchema);

module.exports = User