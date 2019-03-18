import mongoose from 'mongoose'

const uri = process.env.MONGO_URI
console.log(uri)

mongoose.Promise = Promise

mongoose.connect(uri, { useNewUrlParser: true }).then(
    () => { console.log('connected to db') }
    // err => {console.log('failed to connect')}
)

var db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error:'))
