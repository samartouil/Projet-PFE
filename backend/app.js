const express = require("express");
const connectToDb =require ("./config/connectToDB");//appel fichier connection
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");

//Connection To Db
connectToDb();

//init app
const app =express();


//middlewares
app.use(express.json());
//cors policy
app.use(cors({
    origin:"http://localhost:3000"
}))

//routes
app.use("/api/auth",require("./routes/authRoute"));

//running the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`));