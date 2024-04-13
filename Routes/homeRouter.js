const express = require('express')
const homeController=require('../Controllers/homeController')

const router = express.Router();

router.route('/').get(homeController.home)

module.exports=router
