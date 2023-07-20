const express = require("express");
const app = express();
const cors = require('cors');

app.use(cors());

app.use(express.json())

//router
const routes = require("./routes/routes");

app.use("/api", routes)


app.listen(2000, ()=>{
    console.log("on")
})


