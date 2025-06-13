const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

const app = require('./app')
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
//process.env.DATABASE_LOCAL
mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('DB connection successful!')
})


const port = 3000;

const server = app.listen(port, () => {
    console.log(`App is running on port ${port}....`)
})

process.on('unhandledRejection', err => {
    console.log(err.name, err.message)
    server.close(()=>{
        process.exit(1)
    })
})