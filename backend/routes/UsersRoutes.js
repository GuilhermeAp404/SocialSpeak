const router = require('express').Router()
const UserController = require('../controllers/UserController')

//middleware

router.post('/register', UserController.register)

module.exports= router