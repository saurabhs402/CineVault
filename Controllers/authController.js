const User = require('../Models/userModel')
const asyncErrorHandler = require('../Utils/asyncErrorHandler')
const jwt = require('jsonwebtoken')
const customError = require('../Utils/customError')
const util = require('util')
const sendEmail = require('../Utils/email')
const crypto = require('crypto')

const signToken = function (id) {
    return jwt.sign({ id }, process.env.SECRET_STR, {
        expiresIn: process.env.LOGIN_EXPIRES
    })

}
const createSendResponse = function (user, res, statusCode) {

    const token = signToken(user._id)

    const options = {
        maxAge: Number(process.env.LOGIN_EXPIRES),
        httpOnly: true
    }
    if (process.env.NODE_ENV === 'production')
        options.secure = true

    res.cookie('jwt', token, options)

    user.password = undefined

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })


}
const signup = asyncErrorHandler(async function (req, res, next) { // here next is using for the asyncErrorhandler
   
    const newUser = await User.create(req.body)
   

    createSendResponse(newUser, res, 201);

})

const login = asyncErrorHandler(async function (req, res, next) {
    const { email, password } = req.body;

    if (!email || !password)
        throw new customError('Please provide email id and password for login in!', 400);//Bad Request

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePasswordInDB(password, user.password)))
        throw new customError('Incorrect email or password', 400);



    createSendResponse(user, res, 200);
});

const protect = asyncErrorHandler(async function (req, res, next) {
    //1.Read the token and check if it exists
    const testToken = req.headers.authorization;
    let token;
    if (testToken && testToken.startsWith('Bearer'))
        token = testToken.split(' ')[1]

    console.log(token)

    if (!token)
        throw new customError('You are not logged in!', 401);

    //2.Validate the token

    const decodedToken = await util.promisify(jwt.verify)(token, process.env.SECRET_STR);

    // 3. if the user exists
    const user = await User.findOne({ _id: decodedToken.id });

    console.log(user);

    if (!user)
        throw new customError('The user with the given token is not exist', 401);

    // 4. If the user changed the password after token was issued

    if (await user.isPasswordChanged(decodedToken.iat))
        throw new customError('Password has been changed.Please login again', 401);

    // 5. Allow user to access a route--helps in authorization below

    req.user = user

    next()
})

const restrict = function (role) {

    return function (req, res, next) {

        if (req.user.role !== role) {

            const err = new customError('You do not have permission to perform this action', 403);
            next(err)
        }

        next();

    }

}

const forgotPassword = asyncErrorHandler(async function (req, res, next) {
    //1.Get the user based on posted email

    const user = await User.findOne({ email: req.body.email });

    if (!user)
        throw new customError('We could not find the user with given email', 404);

    // 2.Generate a Random Reset Token

    const resetToken = user.createResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // 3. Send the Token back to the user email

    // console.log(req);

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`
    const message = `We have received a reset password request.Please use the below link to reset your password\n\n${resetUrl}`
    console.log(resetUrl)
    try {
        await sendEmail({
            email: user.email,
            subject: 'Password change request received',
            message: message
        })

        res.status(200).json({
            success: 'success',
            message: 'Password reset link send to the user email.'
        })
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpires = undefined;
        user.save({ validateBeforeSave: false })

        throw new customError('There was an error sending password reset email.Please try again later', 500);
    }





});

const resetPassword = asyncErrorHandler(async function (req, res, next) {

    // 1.If the user exits with the given token and token hasn't expired

    const token = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({ passwordResetToken: token, passwordResetTokenExpires: { $gt: new Date() } })

    if (!user)
        throw new customError('Token is invalid or expired', 400);

    // 2.Resetting the user password
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.createResetPasswordToken = undefined;
    user.passwordResetTokenExpires = undefined;
    user.isPasswordChangedAt = Date.now() // implicit convert timestamp(ms) to date

    await user.save(); //here validation requires

    // 3.Login the user
    createSendResponse(user, res, 201)



})



module.exports = {
    signup, login, protect, restrict, forgotPassword,
    resetPassword, createSendResponse, signToken
}