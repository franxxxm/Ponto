const express = require("express");
const app = express();
const hbs  = require('express-handlebars');
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const handlebars = require('handlebars');
const flash = require("connect-flash");



//cookie
app.use(cookieParser());
// Configuração da sessão
app.use(session({
  secret: 'meusegredo',
  resave: false,
  saveUninitialized: true,
  cookie:{
    maxAge:36000000
  }
}));

//configuração da session flash
app.use(flash())

//configuração do json
app.use(express.json())

//middlewares


//configuração handlebars
app.engine("hbs", hbs.engine({
    extname:'hbs',
    defaultLayout:'main'
}));
app.set("view engine", 'hbs');

//bodyparser configuração
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,"public")));


//rotas 
const funcionario = require("./routes/funcionario.js");
const admin = require("./routes/administrador")

app.use("/PoloUAB", funcionario);
app.use("/PoloUAB/adm", admin);

app.listen(3030, ()=>{
    console.log('http://localhost:3030/teste')
})
