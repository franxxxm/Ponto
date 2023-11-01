const {
    default: axios
} = require("axios")


const historicoAdm = (id_usuario)=>{
    return axios.get(`http://192.168.88.15:2000/api/horarios/${id_usuario}`)
}


const historico = (id_usuario, mes, ano) => {
    return axios.post(`http://192.168.88.15:2000/api/historico`, {
        id_usuario,
        mes,
        ano
    })
}

const editar_horarios = (dia, mes, ano, hora, data, id_usuario)=>{
    return axios.post(`http://192.168.88.15:2000/api/horarios/edit`, {
            dia,
            mes,
            ano,
            hora,
            data,
            id_usuario,
        })
}

const verificar = (id_usuario) => {
    const date = new Date();
    const dia = date.getDate();
    const mes = date.getMonth() + 1;
    const ano = date.getFullYear();

    return axios.post(`http://192.168.88.15:2000/api/verificar`, {
        id_usuario,
        dia,
        mes,
        ano
    })
}

const horarios_entrada = (id_usuario, entrada, saida) => {
    var data = new Date();
    var hora = data.getHours();
    var minutos = data.getMinutes();
    const dia = data.getDate();
    const mes = data.getMonth() + 1;
    const ano = data.getFullYear();
    if (hora < 10) hora = "0" + hora;
    if (minutos < 10) minutos = "0" + minutos;
    hora = hora + ":" + minutos
    data = data.toLocaleDateString()
    return axios.post(`http://192.168.88.15:2000/api/horarios`, {
        entrada,
        saida,
        hora,
        dia,
        mes,
        ano,
        data,
        id_usuario
    })
}

const editar_horarios_saida = (dia, mes, ano, hora_saida, id_usuario)=>{
    return axios.post(`http://192.168.88.15:2000/api/horario-saida`, {
        hora_saida,
        dia,
        mes,
        ano,
        id_usuario
    })
}

const horarios_saida = (id_usuario) => {
    var data = new Date();
    var hora = data.getHours();
    var minutos = data.getMinutes();
    const dia = data.getDate();
    const mes = data.getMonth() + 1;
    const ano = data.getFullYear();
    if (hora < 10) hora = "0" + hora;
    if (minutos < 10) minutos = "0" + minutos;
    var hora_saida = hora + ":" + minutos
    return axios.post(`http://192.168.88.15:2000/api/horario-saida`, {
        hora_saida,
        dia,
        mes,
        ano,
        id_usuario
    })
}

module.exports = {
    verificar,
    historico,
    horarios_entrada,
    horarios_saida,
    editar_horarios,
    editar_horarios_saida,
    historicoAdm
}