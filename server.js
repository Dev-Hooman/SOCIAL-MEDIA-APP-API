const cors = require('cors')
const express = require('express')
const bp = require('body-parser')
const passport = require('passport')
const { connect } = require('mongoose')
const {success, error} = require('consola')

const { DB, PORT } = require('./config')

const app = express()

app.use(cors())
app.use(bp.json())
app.use(passport.initialize());


require('./middlewares/passport')(passport);
app.use('/api/users', require('./routes/user'))



const startDB = async () => {
    connect(DB )
    .then(()=> success({message:  "Connected With Database...📙" , badge : true }))
    .catch((err)=>{error({message: `Unable to Connect with Database  ${err}`})})
} 
startDB();
app.listen(PORT, ()=>{
   success({message: `Server Started, Listening on PORT ${PORT}`, badge : true})
})