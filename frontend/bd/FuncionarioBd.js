const {
    default: axios
} = require("axios")

const getFuncionarios = () => {
    return axios.get('http://192.168.88.15:2000/api/funcionario')
}

const getFuncionarioId = (id) =>{
    return axios.get(`http://192.168.88.15:2000/api/funcionario/${id}`)
}

const creatFuncionario = (matricula, senha, nome_completo) =>{
    return axios.post(`http://192.168.88.15:2000/api/funcionario`,{matricula, senha, nome_completo})
}

const upFuncionario = (id_usuasrio, senha)=>{
    return axios.put('http://192.168.88.15:2000/api/funcionario/senha/' + id_usuasrio, {senha})
}

module.exports = {
    getFuncionarios,
    getFuncionarioId,
    creatFuncionario,
    upFuncionario
}