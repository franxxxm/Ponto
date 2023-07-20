const bd = require("./bd")


    const createHorario = async ({entrada, saida, hora, dia, mes, ano, id_usuario})=>{

        const horarios = {
            entrada,
            saida,
            hora,
            dia,
            mes, 
            ano,
            id_usuario
        }

        const sql = `INSERT INTO horarios(entrada, saida, hora_entrada, dia, mes, ano, id_usuarios) VALUES('${horarios.entrada}', '${horarios.saida}', '${horarios.hora}', '${horarios.dia}', '${horarios.mes}', '${horarios.ano}', '${horarios.id_usuario}')`
        const result = await bd.query(sql);

        return result;
    } 

    const upHorarioSaida = async ({id_usuario,hora_saida,ano,mes,dia})=>{
        const sql = `UPDATE horarios SET saida = '1', hora_saida = '${hora_saida}' WHERE id_usuarios = '${id_usuario}' AND ano = '${ano}' AND mes = '${mes}' AND dia = '${dia}'`
        const result = await bd.query(sql)

        return result
    }

    const getHorariosIdUser = async (id_usuario)=>{
        const sql = `SELECT * FROM horarios WHERE id_usuarios = '${id_usuario}'`
        const [result] = await bd.query(sql);

        return result
    }

    const verificarRegistro = async ({id_usuario, mes, dia, ano}) =>{
        const sql = `SELECT * FROM horarios WHERE id_usuarios = '${id_usuario}' AND ano = '${ano}' AND mes = '${mes}' AND dia = '${dia}'`
        const [result] = await bd.query(sql)

        return result
    }




module.exports = {
    createHorario,
    getHorariosIdUser,
    verificarRegistro,
    upHorarioSaida
}
