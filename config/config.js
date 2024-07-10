const mongoose = require('mongoose');

const connectDatabase = async () => {
    try {
        console.log(`your database ${process.env.DATABASE_NAME} is connected`);
        return mongoose.connect(process.env.LOCAL_DATABASE_URI + process.env.DATABASE_NAME);
    } catch (error) {
        console.log("Database not connected error:", error);
    }
}


module.exports = { connectDatabase }