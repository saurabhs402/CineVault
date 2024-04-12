const User = require('../Models/userModel')
const asyncErrorHandler = require('../Utils/asyncErrorHandler')
const customError = require('../Utils/customError')

const authController = require('./authController')

const filterReqBody = function (reqBody, ...allowedFields) {
    const newObj = {}
    Object.keys(reqBody).forEach(function (prop) {
        if (allowedFields.includes(prop))
            newObj[prop] = reqBody[prop]
    })
    return newObj;
}
const getAllUsers = asyncErrorHandler(async function (req, res, next) {
    const users = await User.find();

    res.status(200).json({
        success: 'success',
        length: users.length,
        data: {
            users
        }

    })


})
const updatePassword = asyncErrorHandler(async function (req, res, next) {

    //Get Current User Data from database
    const user = await User.findOne({ _id: req.user._id }).select('+password');

    // Check if the supplied password is correct

    if (!(await user.comparePasswordInDB(req.body.currentPassword, user.password)))
        throw new customError('The current password you provided is wrong!', 401);

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();

    //Login User and send jwt

    authController.createSendResponse(user, res, 200)



})

const updateMe = asyncErrorHandler(async function (req, res, next) {
    //Check if the request data contain password |Confirm password

    if (req.body.password || req.body.confirmPassword)
        throw new customError('You cannot update password using this endPoint', 400);

    const filterBody = filterReqBody(req.body, 'name', 'email');
    console.log(filterBody)

    const updatedUser = await User.findOneAndUpdate({ _id: req.user._id }, { $set: filterBody });
    //  new and runValidators automatically true


    
    res.status(200).json({
        status: 'success',
        data: {
            updatedUser
        }
    })





});
const deleteMe = asyncErrorHandler(async function (req, res, next) {
    await User.findOneAndUpdate({ _id: req.user._id }, { $set: { active: false } })

    res.status(204).json({
        status: 'success',
        data: null
    })

})

module.exports = { getAllUsers, updatePassword, updateMe, deleteMe }