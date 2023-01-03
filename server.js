const express = require('express');
const app = express();
require('dotenv').config();
const db = require('./config/db');
const path = require('path');
app.use(express.json());
const userRoute = require('./routes/userRoute');
const adminRoute = require('./routes/adminRoute');
const doctorRoute = require("./routes/doctorsRoute");

app.use('/api/user', userRoute);
app.use('/api/admin', adminRoute);
app.use('/api/doctor', doctorRoute);

const port = process.env.PORT || 5000;

if (process.env.NODE_ENV === "production") {
  app.use("/", express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client/build/index.html"));
  });
}

app.listen(port, () => {
    console.log(`backend is running fine on port ${port}`);
})