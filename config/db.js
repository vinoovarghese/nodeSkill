const mongoose = require("mongoose");

const config = require("config");

const db = config.get("mongodb")

const connectionToDb = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        console.log("Mongo Db connection was successful ....");
    } catch (err) {
        console.log(err.message)
        process.exit(1)
    }

}

module.exports = connectionToDb;