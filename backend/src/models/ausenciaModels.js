const bd = require("./bd")



const createAusencia = async ({data_entrada, data_saida, atestado, ferias, id_usuario})=>{
    const sql = `INSERT INTO ausencia(atestado, ferias, data_entrada, data_saida, id_usuario) VALUES('${atestado}', '${ferias}', '${data_entrada}','${data_saida}', '${id_usuario}')`

    const [ausencia] = await bd.query(sql)

    const sql2 = `SELECT nome_completo FROM usuarios WHERE matricula = '${id_usuario}'`
    const [usuario] = await bd.query(sql2)

    return usuario
}

const getAusenciaUser = async ()=>{
    const data = new Date()
    const dataHoje = data.toLocaleDateString()
    var dataBd 
    var dataSeparadas
    var ausencia = [] 
    const sql = `SELECT * FROM ausencia JOIN usuarios ON ausencia.id_usuario = usuarios.matricula`

    const [result] = await bd.query(sql)

    for (const key in result) {
        dataSeparadas = result[key].data_saida.split("/")
        dataBd = new Date(dataSeparadas[2], dataSeparadas[1], dataSeparadas[0])
        if(dataBd.toLocaleDateString() > dataHoje){
            ausencia.push(result[key])
        }
    }
    return ausencia
}

const getAusencia = async ()=>{
    const sql = `SELECT * FROM ausencia JOIN usuarios ON ausencia.id_usuario = usuarios.matricula`
    const [result] = await bd.query(sql)
    return result
}

const getAusenciaId = async (id)=>{
    const sql = `SELECT * FROM ausencia WHERE id_usuarios = '${id}'`
    const [ausencia] = await bd.query(sql)

    return ausencia
}

const deleteAusencia = async (id, {entrada, saida})=>{
    console.log(id, entrada, saida)
    const sql = `DELETE FROM ausencia WHERE id_usuario = '${id}' AND data_entrada = '${entrada}' AND data_saida = '${saida}'`
    const atestado = await bd.query(sql)

    return atestado
}



module.exports = {
    createAusencia,
    getAusenciaUser,
    getAusenciaId,
    getAusencia,
    deleteAusencia
}