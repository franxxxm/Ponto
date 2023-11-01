const { json } = require("sequelize")
const modelsAusencia = require("../models/ausenciaModels")


const createAtestado = async (req, res)=>{
    const ausencia = await modelsAusencia.createAusencia(req.body)

    return res.status(201).json({mensagem:true, ausencia},)
}

const getAusenciaUser = async (req, res)=>{
    const ausencia = await modelsAusencia.getAusenciaUser(req.body)

    return res.status(201).json(ausencia)
}

const getAusencia = async(req, res)=>{
    const ausencia = await modelsAusencia.getAusencia()

    return res.status(201).json(ausencia)
}

const getAusenciaId = async(req, res)=>{
    const ausencia = await modelsAusencia.getAusenciaId(req.params.id)

    return res.status(201).json(ausencia)
}

const deleteAusencia = async (req, res)=>{
    const ausencia = await modelsAusencia.deleteAusencia(req.params.id, req.body)

    return res.status(201).json({mensagem:true})
}


module.exports = {
    createAtestado,
    getAusencia,
    getAusenciaUser,
    getAusenciaId,
    deleteAusencia
}