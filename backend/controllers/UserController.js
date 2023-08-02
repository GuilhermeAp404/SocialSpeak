const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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

    }

    static async checkUser(req, res){

    }

    static async editUser(req, res){

    }

}