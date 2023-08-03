const mongoose = require('mongoose')

async function connectToDataBase(){
    try{
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('Acesso ao MongoDB')
    }catch(err){
        console.log('Acesso ao MongoDB foi negado')
        console.log(err)
        process.exit(1)
    }
}

connectToDataBase()

module.exports = mongoose