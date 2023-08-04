const express = require('express')
require('dotenv').config()
const cors = require('cors')
const path=require('path')

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
app.use('/files', express.static(path.resolve(__dirname, '../upload')))

//routes
const UsersRoutes = require('./routes/UsersRoutes')
const RoomsRoutes = require('./routes/RoomsRoutes')

app.get('/', (req, res)=>{
    res.status(200).json({
        message: 'Bem-Vindo!'
    })
})

app.use('/user', UsersRoutes)
app.use('/room', RoomsRoutes)

app.listen(5000)