const mongoose = require('mongoose')

async function connectToDataBase(){
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/socialspeak', {
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