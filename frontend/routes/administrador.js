const {
    default: axios
} = require("axios");
const routes = require("express").Router();
const jwt = require('jsonwebtoken');
const online = require("../middlewares/rotaOnline")
const offline = require("../middlewares/rotaOffline")


    routes.get("/menu", (req, res)=>{
        res.render("./admin/menu.hbs")
    })

    routes.get("/Historico-Funcionario", (req, res)=>{
        res.render('./admin/historicoFuncionario.hbs');
    })



module.exports = routes