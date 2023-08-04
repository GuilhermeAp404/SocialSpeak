const { default: mongoose } = require('mongoose')
const Room = require('../models/Room')
const User = require('../models/User')
const bcrypt = require('bcrypt')


module.exports = class RoomController{
    //create room
    static async createRoom(req, res){
        //get creator id
        const creator=await User.findById(req.user.userId).select(['tag','_id'])
        let room=null

        //get body informations
        const {title, description, password} = req.body
        
        //validations
        if(!title){
            res.status(401).json({message: 'Para criar a sala e necessario que você coloque o título'})
            return
        }

        //check if the room has a password
        if(password){
            const salt = bcrypt.genSaltSync(10)
            const passwordHash =  bcrypt.hashSync(password, salt)
            room=new Room({
                creator,
                title,
                description,
                participants:[creator._id],
                password:passwordHash
            })
        }else{
            room=new Room({
                creator,
                title,
                description,
                participants:[creator._id],
            })
        }

        //create the room with all configs
        try{
            await room.save()
            res.status(201).json({message:'Sala criada com sucesso!'})
        }catch(err){
            res.status(500).json({message: err})

        }
    
    }

    //join in room
    static async joinRoom(req, res){
        //get user auth
        const user=await User.findById(req.user.userId).select(['tag','_id'])
        
        //get room by id
        const room = await Room.findById(req.params.id)
        
        //validations
        const isUserInRoom = room.participants.filter((participant)=> participant.equals(user._id)).length>0
        if(isUserInRoom){
            res.status(403).json({message: 'Você já está nesta sala'})
            return
        }
        
        if(room.password){
            const {password}= req.body
            if(!password){
                res.status(401).json({message:'Para entrar a senha é necessaria'})
                return
            }
            const checkPassword=await bcrypt.compare(password, room.password)
            if(!checkPassword){
                res.status(401).json({message:'A senha da Sala está incorreta'})
                return
            }
            room.participants.push(user._id)
            
        }else{
            room.participants.push(user._id)
        }
        
        try{
            await Room.updateOne(
                {_id:room._id},
                {$set:room}               
            )

            res.status(200).json({message:'Você Entrou na sala'})
        }catch(err){
            res.status(500).json({message:err})
        }
    }

    //all rooms
    static async allRooms(req, res){
        const rooms = await Room.find().sort('-createdAt')

        res.status(200).json({rooms: rooms})
    }

    //rooms create by user
    static async createByUser(req, res){
        const user = await User.findById(req.user.userId)
        const roomsCreatedByUser = await Room.find({'creator._id': user._id}).sort('-createdAt')

        res.status(200).json({rooms: roomsCreatedByUser})
    }
    
    //single room with posts

    //edit room
    
    //leave room
    
    //delete room
}