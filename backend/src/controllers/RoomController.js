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
        //Find all rooms
        const rooms = await Room.find().sort('-createdAt')

        res.status(200).json({rooms: rooms})
    }

    //rooms create by user
    static async allRoomUser(req, res){
        //get user
        const user = await User.findById(req.user.userId)

        //find all user rooms
        const allUserRooms = await Room.find({participants: {$in:[user._id]}}).sort('-createdAt')

        res.status(200).json({rooms: allUserRooms})
    }
    
    //edit room
    static async editRoom(req, res){
        //get user
        const user = await User.findById(req.user.userId)

        //get room
        const room = await Room.findById(req.params.id)

        // req body atts
        const {title, description, password} = req.body

        if(!room.creator._id.equals(user._id)){
            res.status(401).json({message:'Você só pode atualizar os dados de uma sala se for o criador dela'})
            return
        }

        room.description = description

        if(!title){
            res.status(401).json({message:'O título é necessário'})
            return
        }else{
            room.title = title
        }

        if(room.password){
            if(!password){
                res.status(401).json({message:'Você só pode atualizar os dados dessa sala com a senha dela'})
                return
            }
            
            const checkPassword=await bcrypt.compare(password, room.password)
            if(!checkPassword){
                res.status(401).json({message:'A senha da Sala está incorreta'})
                return
            }
        }else{
            if(password){
                const salt = bcrypt.genSaltSync(10)
                const passwordHash =  bcrypt.hashSync(password, salt)

                room.password=passwordHash
            }
        }

        try {
            await Room.updateOne(
                {_id: room._id},
                {$set: room}
            )
            res.status(200).json({message: 'Os dados da sala foram atualizados com sucesso'})
        } catch (err) {
            res.status(200).json({message: err})
        }

    }
    
    //leave room
    static async leaveRoom(req, res){
        //get user
        const user=await User.findById(req.user.userId)

        //get room
        const room = await Room.findById(req.params.id)

        if(room.creator._id.equals(user._id)){
            res.status(401).json({message:'Você não pode sair da sala que você criou'})
            return
        }

        //att room participants list
        room.participants = room.participants.filter((participant)=> !participant.equals(user._id))

        try{
            await Room.updateOne(
                {_id:room._id},
                {$set: room}    
            )

            res.status(200).json({message:'Você saiu da sala'})
        }catch(err){
            res.status(500).json({message: err})
        }     
        
    }
    //delete room
    static async deleteRoom(req, res){
        //get user
        const user = await User.findById(req.user.userId)

        //get room by id param
        const room = await Room.findById(req.params.id)

        //check if user is the room creator
        if(!room.creator._id.equals(user._id)){
            res.status(401).json({message: 'Você só pode deletar uma sala se for o criador dela'})
            return
        }

        try{
            await Room.findByIdAndRemove(room._id)
            res.status(200).json({message: 'Você deletou uma sala'})
        }catch(err){
            res.status(500).json({message: err})
        }
    }

}