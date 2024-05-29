const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors);

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Connected to db, listening on port ${process.env.PORT}`);
    });
})
.catch((err) => {
    console.log("Error connecting to db: ", err);
});


