const nodemailer = require('nodemailer')
const customError = require('./customError')

const sendEmail = async function (options) {

    // Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    // Define email options

    console.log(transporter)
    const emailOptions = {
        from: 'Cineflix support<support@cineflix.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    return transporter.sendMail(emailOptions);
}

module.exports = sendEmail;