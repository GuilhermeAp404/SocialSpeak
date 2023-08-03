const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next)=>{
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    
    if(!token){
        res.status(401).json({message: 'Acesso não autorizado'})
        return
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, user)=>{
        if(err){
            res.status(403).json({message: 'Token inválido'})
        }
        req.user = user
        next()
    })
    
}

module.exports = verifyToken