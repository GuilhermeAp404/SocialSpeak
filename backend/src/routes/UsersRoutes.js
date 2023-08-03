const router = require('express').Router()
const UserController = require('../controllers/UserController')

//helpers
const verifyToken = require('../helpers/verify-token')
const {imageUpload} = require('../helpers/image-upload')

//middleware

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/checkuser', verifyToken, UserController.checkUser)
router.get('/:id', UserController.getUserById)
router.patch(
    '/edituser',
    verifyToken, 
    imageUpload.single('image'),
    UserController.editUser
)

module.exports= router