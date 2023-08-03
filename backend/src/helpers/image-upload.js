const multer=require('multer')
const path=require('path')


const storage=multer.diskStorage({
    destination:(req, file, cb)=>{
        let uploadDir= path.resolve(__dirname, '../../upload')
        
        if(req.baseUrl.includes('user')){
            uploadDir = path.join(uploadDir, '/users')
        }else if(req.baseUrl.includes('post')){
            uploadDir = path.join(uploadDir, '/posts')
        }
        
        cb(null, uploadDir)
    },
    filename: (req, file, cb)=>{
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random()*1E9)
        const fileExtension = path.extname(file.originalname)
        
        cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension)
    },
})

const imageUpload = multer({
    storage: storage,
    fileFilter: (req, file, cb)=>{
        if(!file.originalname.match(/\.(png|jpg)$/)){
            return cb(new Error('Por favor envie apenas jpg ou png'))
        }
        cb(undefined, true)
    }
})

module.exports={imageUpload}