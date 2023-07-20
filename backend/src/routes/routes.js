const express  = require("express")
const rotas = express.Router()
const funcionarios = require("./funcionario")
const hora = require("./horarios")


rotas.use("/", funcionarios)
rotas.use("/", hora)

module.exports = rotas