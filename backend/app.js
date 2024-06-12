const express = require("express");
const connectToDb =require ("./config/connectToDB");//appel fichier connection
const cors = require("cors");
require("dotenv").config();
require('./cronJob/cronJob');
const bodyParser = require("body-parser");

//Connection To Db
connectToDb();

//init app
const app =express();


//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(bodyParser.json())

//cors policy
app.use(cors({
    origin:"http://localhost:3000"
}))

//routes
app.use("/api/auth",require("./routes/authRoute"));//najm n3aytelha lfouk
app.use("/api/users",require("./routes/usersRoute"));
app.use("/api/equipements",require("./routes/equipementRoute"));
app.use("/api/projets",require("./routes/projetRoute"));
app.use("/api/BI",require("./routes/BiRoute"));

//running the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`));