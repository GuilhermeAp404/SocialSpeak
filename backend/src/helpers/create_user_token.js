const jwt=require('jsonwebtoken')

const createToken = async (user, req, res)=>{
    const token=jwt.sign({
        name:user.name,
        userId:user._id,
    }, process.env.SECRET_KEY)

    //return token
    res.status(200).json({
        message:'Token gerado com sucesso',
        token: token,
        user: user._id
    })
}

module.exports=createToken