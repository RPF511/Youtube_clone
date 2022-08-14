//require('dotenv').config(); in this method, we have to include this line to all files which requires .env
import "regenerator-runtime";
import "dotenv/config";
import "./db";
import "./models/Video";
import "./models/User";
import app from "./server";

const PORT = 4000;

const handleListening = () => 
    console.log(`Server listening on port  http://localhost:${PORT}`);

app.listen(PORT, handleListening);