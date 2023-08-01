const express = require('express')
const cors = require('cors')

const app = express()

//config json
app.use(express.json())

//config cors
const corsOptions = {
    credentials: true,
    origin: 'http://localhost:3000',
    methods: 'GET, POST, PUT, PATCH, DELETE',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
}
app.use(cors(corsOptions))

//public folder
app.use(express.static('public'))

//routes
app.get('/', (req, res)=>{
    res.status(200).json({
        message: 'Bem-Vindo!'
    })
})

app.listen(5000)