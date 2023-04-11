const cors = require('cors')
const express = require('express')
const bp = require('body-parser')
const passport = require('passport')
const {success, error} = require('consola')
const mongodb = require('./cluster/DB')
const Pusher = require("pusher");
const mongoose = require('mongoose')

const { PORT } = require('./config')

const MESSAGES = require('./models/chatSchema')

mongodb.mongodbConnection();
const app = express()

app.use(cors())
app.use(bp.json())
app.use(passport.initialize());

const pusher = new Pusher({
    appId: "1468092",
    key: "edb2a96e20682cf69c6d",
    secret: "f5e86301035155dfcbb0",
    cluster: "ap2",
    useTLS: true
});

const db = mongoose.connection;
db.once("open", () => {
    console.log("DB Connected");

    const msgCollection = db.collection("messagecontents") //collection name should be mention correctly
    const changeStream = msgCollection.watch();

    changeStream.on("change", (change) => {
        console.log("a change occured", change);

        if (change.operationType === "insert") {
            const messageDetails = change.fullDocument;
            console.log("Full Document", messageDetails);
            pusher.trigger('messages', 'inserted',
                {
                    name: messageDetails.name,
                    message: messageDetails.message,
                    timestamp: messageDetails.timestamp,
                    recieved: messageDetails.recieved,
                    roomID: messageDetails.roomID,
                    msgNo: messageDetails.msgNo
                }//debug Console
            );
        } else {
            console.log("Error Triggering Pusher");
        }
    })

})

app.post('/ap/v1/messages/new', (req, res) => {
    const dbMessage = req.body;

    console.log("dbMessage => ", dbMessage)
    const { message, name, timestamp, recieved, roomID } = req.body;


    // CHAT_COUNTER.findOneAndUpdate({id:"autoval"}, {"$inc" : {"seq" : 1}},{new:true}, (err,cd) =>{
    // let seqId
    //     if(cd === null){

    //         const newVal = new CHAT_COUNTER({id:"autoval", seq : 1})
    //         newVal.save()
    //         seqId = 1

    //     }else{
    //         seqId = cd.seq

    //     }
    // })

    MESSAGES.create({ message: message, name: name, timestamp: timestamp, recieved: recieved, roomID: roomID }, (err, data) => {
        if (err) {
            //Inter Server Error => CODE: 500
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
            console.log(data);
        }
    })
})


app.get("/messages/sync", (req, res) => {

    MESSAGES.find((err, data) => {
        if (err) {
            res.status(500).send(err)
        }
        else {
            res.status(200).send(data)
            console.log(data);
        }
    })

})

require('./middlewares/passport')(passport);
app.use('/api/users', require('./routes/user'))




app.listen(PORT, ()=>{
   success({message: `Server Started, Listening on PORT ${PORT}`, badge : true})
})