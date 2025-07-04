const express = require('express')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')



const router = express.Router();


router.post('/signup', authController.signup)
router.post('/login', authController.login)

router.post('/forgotPassword', authController.forgotPassword)
router.patch('/resetPassword/:token', authController.resetPassword)

// Protects all routes after this middleware
router.use(authController.protect)

router.patch('/updateMyPassword', authController.updatePassword)

router
.get(
    '/Me', 
    userController.getMe, 
    userController.getUser
)
.patch(
    '/updateMe',
    userController.uploadUserPhoto, 
    userController.resizeUserPhoto, 
    userController.updateMe
)

// router.delete('/deleteMe', authController.protect, userController.deleteMe)


router.use(authController.restrictTo('admin'))


router
.route('/')
.get(userController.getAllUsers)
.post(userController.createUser)

router
.route('/:id')
.get(userController.getUser)
.patch(userController.updateUser)

module.exports = router