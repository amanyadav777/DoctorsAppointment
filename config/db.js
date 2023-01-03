const mongoose = require('mongoose');

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URL);

const connection = mongoose.connection;

connection.on("connected", () => {
    console.log('Mongodb connected succesfully');
})

connection.on("error", (error) => {
    console.log('Error in connecting with mongodb', error);
})

module.exports = mongoose;