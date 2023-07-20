const FuncionarioControllers = require("../controllers/funcionarioControllers");
//const middlewares = require("../middlewares/verificarCampos")
const express = require('express')
const router = express.Router();
//const DadosToken = require("../middlewares/receberDadosToken");

router.post("/funcionario",  FuncionarioControllers.createFuncionario);
router.get("/funcionario/adm", FuncionarioControllers.getAllFuncionario);
router.get("/funcionario/:id",  FuncionarioControllers.getIdFuncionario);
router.delete("/funcionario/:id", FuncionarioControllers.deleteFuncionario);
router.put("/funcionario/:id",  FuncionarioControllers.setFuncionario);
router.post("/funcionario/login", FuncionarioControllers.login);

module.exports = router