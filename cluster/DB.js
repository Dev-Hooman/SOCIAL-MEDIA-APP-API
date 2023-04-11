const mongoose = require("mongoose");
const { DB } = require('../config/index')

const mongodbConnection = async () => {

    try {
        await mongoose.connect(DB);
        console.log("CLUSTER: Connection Successfull!!!");
    } catch (err) {
        console.log("No Connection...");

    }

}

module.exports = {mongodbConnection}







