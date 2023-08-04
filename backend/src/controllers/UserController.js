const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//helpers
const createToken = require('../helpers/create_user_token')

module.exports = class UserController{
    
    static async register(req, res){
        //get body form
        const {name, email, password, confirmPassword, tag} = req.body

        if(!name){
            res.status(422).json({message: 'O nome é necessário para fazer o registro'})
            return
        }
        if(!email){
            res.status(422).json({message: 'O e-mail é necessário para fazer o registro'})
            return
        }
        if(!tag){
            res.status(422).json({message: 'A sua tag de usuário e necessária'})
            return
        }
        if(!password){
            res.status(422).json({message: 'A senha é necessária para fazer o registro'})
            return
        }
        if(!confirmPassword){
            res.status(422).json({message: 'É necessário confirmar a senha para se registrar'})
            return
        }
        if(confirmPassword != password){
            res.status(422).json({message: 'As senhas precisam ser iguais'})
            return
        }

        //User exists verification
        const userExists = await User.findOne({email:email})

        if(userExists){
            res.status(422).json(
                {
                    message:'Esse e-mail já está sendo utilizado'
                }
            )
            return
        }

        //generate pass hash
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        //create user
        const user = new User({
            name,
            email,
            password: passwordHash,
            tag
        })

        try {
            await user.save()
            res.status(200).json({message: 'Registrado com sucesso!'})
        } catch (error) {
            res.status(500).json({message: error})
        }

    }

    static async login(req, res){
        //get body form
        const {email, password}=req.body

        if(!email){
            res.status(422).json({message: 'O e-mail é necessário para fazer o login'})
            return
        }
        if(!password){
            res.status(422).json({message: 'A senha é necessária para fazer o login'})
            return
        }

        //user exists verification
        const user= await User.findOne({email:email})
        
        if(!user){
            res.status(404).json({message:'O usuário não existe'})
            return 
        }

        const checkPassword=await bcrypt.compare(password, user.password)
        if(!checkPassword){
            res.status(422).json({message: 'A senha está inválida!'})
            return
        }

        await createToken(user, req, res)
    }

    static async checkUser(req, res){
        const userId = req.user.userId
        
        const currentUser = await User.findById(userId).select(['-password', '-rooms'])
        res.status(200).send({user: currentUser})
    }

    static async getUserById(req, res){
        const {id}=req.params

        const user = await User.findById(id).select('-password')
        if(!user){
            res.status(422).json({
                message: 'Usuário não encontrado'
            })
            return
        }

        res.status(200).json({user:user})
    }

    static async editUser(req, res){
        const currentUser = req.user.userId
        
        const user = await User.findById(currentUser)

        const {email, password, confirmPassword, tag} = req.body

        let image = ''

        if(req.file){
            user.image = req.file.filename
        }

        //validations
        if(!email){
            res.status(401).json({message: 'O E-mail é necessário para atualizar seus dados'})
            return 
        }
        
        if(email != user.email){
            res.status(401).json({message: 'O E-mail precisa ser o registrado'})
            return 
        }

        if(!tag){
            res.status(401).json({message: 'A sua Tag é obrigatoria'})
            return 
        }else{
            user.tag = tag
        }
        
        if(!password){
            res.status(401).json({message: 'A senha é necessária para atualizar seus dados'})
            return
        }
        
        const checkPassword=await bcrypt.compare(password, user.password)
        if(!checkPassword){
            res.status(422).json({message: 'A senha está inválida!'})
            return
        }
        
        if(!confirmPassword){
            res.status(401).json({message: 'A confirmação de senha é necessária para atualizar seus dados'})
            return
        }

        if(password != confirmPassword){
            res.status(401).json({message: 'As senhas precisam ser iguais'})
            return
        }

        try{
            await User.updateOne(
                {_id:user._id},
                {$set: user},
            )
            res.status(200).json({message:'Usuário atualizado com sucesso!'})
        }catch(err){
            res.status(500).json({message: err})
        }
    }

}