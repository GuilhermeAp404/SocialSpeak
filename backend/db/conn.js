const mongoose = require('mongoose')

async function connectToDataBase(){
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/socialspeak', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        })
        console.log('Acesso ao MongoDB')
    }catch{
        console.log('Acesso ao MongoDB foi negado')
        process.exit(1)
    }
}

connectToDataBase()

module.exports = mongoose