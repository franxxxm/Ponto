const express  = require("express")
const rotas = express.Router()
const funcionarios = require("./funcionario")
const hora = require("./horarios")
const ausencia = require('./ausencia')


rotas.use("/", funcionarios)
rotas.use("/", hora)
rotas.use("/", ausencia)

module.exports = rotas