const { response } = require("express")
const horarios = require("../models/horarios.js")



const createHorarios = async (req, res)=>{
    const result = await horarios.createHorario(req.body)

    return res.status(201).json({mensagem:true})

}

const upHorarioSaida = async (req, res)=>{
    const result = await horarios.upHorarioSaida(req.body)

    return res.status(201).json({mensagem:true})
}

const getHorariosIdUser = async (req, res)=>{
    const result = await horarios.getHorariosIdUser(req.params.id)

    return res.status(201).json(result)
}

const verificarRegistro = async (req, res)=>{
    const result = await horarios.verificarRegistro(req.body)
    if(result.length > 0){
        if(result[0].entrada == 1 && result[0].saida == 1){
            return res.status(201).json({registro:true, entrada:true, saida:true})
        }
        if(result[0].entrada == 1){
            return res.status(201).json({registro:true, entrada:true, saida:false})
        }
    }
    
    return res.status(201).json({registro:false, entrada:false, saida:false})
}

module.exports = {
    createHorarios,
    getHorariosIdUser,
    verificarRegistro,
    upHorarioSaida
}