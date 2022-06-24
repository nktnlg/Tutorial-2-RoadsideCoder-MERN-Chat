const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`MongoDB connected: ${connection.connection.host}`.magenta.bold)
    } catch(error) {
        console.log(`Error: ${error.message}`.red.bold)
        process.exit()
    }
}

module.exports = connectDB;