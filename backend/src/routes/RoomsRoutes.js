const router = require('express').Router()
const RoomController = require('../controllers/RoomController')

//middlewares
const verifyToken = require('../helpers/verify-token')
//helpers
const {imageUpload} = require('../helpers/image-upload')

router.post('/createroom', verifyToken, RoomController.createRoom)
router.patch('/join/:id', verifyToken, RoomController.joinRoom)
router.get('/all', RoomController.allRooms)
router.get('/all/userallrooms', verifyToken, RoomController.allRoomUser)
router.patch('/leave/:id', verifyToken, RoomController.leaveRoom)
router.patch('/edit/:id', verifyToken, RoomController.editRoom)
router.delete('/delete/:id', verifyToken, RoomController.deleteRoom)

module.exports=router