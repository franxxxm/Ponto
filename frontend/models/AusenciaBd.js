const {
    default: axios
} = require("axios");

const verificar = async () => {
    try {
        return await axios.get(`http://192.168.88.52:2000/api/ausencia`)

    } catch (error) {
        console.log(error)
    }
}

const createAusencia = async (data_entrada, data_saida, id_usuario, ferias, atestado) => {
    try {
        return await axios.post(`http://192.168.88.52:2000/api/ausencia`, {
            data_entrada,
            data_saida,
            id_usuario,
            ferias,
            atestado
        })
    } catch (error) {
        console.log(error)
    }
}

const getUserId = async (id) => {
    try {
        return await axios.get(`http://192.168.88.52:2000/api/ausencia/` + id)
    } catch (error) {
        console.log(error)
    }
}

const delet = async (id) => {
    try {
	return await axios.delete(`http://192.168.88.52:2000/api/ausencia/` + id)
} catch (error) {
	console.log(error)
}
}

module.exports = {
    verificar,
    createAusencia,
    getUserId,
    delet
}