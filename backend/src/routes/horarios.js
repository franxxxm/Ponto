const express = require('express')
const router = express.Router();
const horarios = require("../controllers/horarios")


router.get("/horarios/:id", horarios.getHorariosIdUser)
router.post("/horarios", horarios.createHorarios)
router.post("/verificar", horarios.verificarRegistro)
router.post("/horario-saida", horarios.upHorarioSaida)





module.exports = router