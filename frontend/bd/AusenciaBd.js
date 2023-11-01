const { default: axios } = require("axios");

const verificar = ()=>{
   return axios.get(`http://192.168.88.15:2000/api/ausencia`)
}

const createAusencia = (data_entrada, data_saida, id_usuario, ferias, atestado)=>{
    return axios.post(`http://192.168.88.15:2000/api/ausencia`, {data_entrada, data_saida, id_usuario, ferias, atestado})
}

module.exports = {
    verificar,
    createAusencia
}