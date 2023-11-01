const express = require('express')
const router = express.Router();
const horarios = require("../controllers/horariosControllers")


router.get("/horarios/:id", horarios.getHorariosIdUser)
router.post("/historico", horarios.getHorariosHistorico)
router.post("/historico/ano", horarios.getHorariosAno)
router.post("/horarios/edit", horarios.editHorarios)
router.post("/horarios", horarios.createHorarios)
router.post("/verificar", horarios.verificarRegistro)
router.post("/horario-saida", horarios.upHorarioSaida)





module.exports = router