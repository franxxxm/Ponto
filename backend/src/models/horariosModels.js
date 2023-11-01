const bd = require("./bd")


const createHorario = async ({
    entrada,
    saida,
    hora,
    dia,
    mes,
    ano,
    id_usuario,
    data
}) => {

    const horarios = {
        entrada,
        saida,
        hora,
        dia,
        mes,
        ano,
        id_usuario,
        data
    }

    const sql = `INSERT INTO horarios(data, entrada, saida, hora_entrada, dia, mes, ano, id_usuarios) VALUES('${horarios.data}', '${horarios.entrada}', '${horarios.saida}', '${horarios.hora}', '${horarios.dia}', '${horarios.mes}', '${horarios.ano}', '${horarios.id_usuario}')`
    const horario = await bd.query(sql);

    return horario;
}

const editHorarios = async ({
    hora,
    id_usuario,
    data,
    dia,
    mes,
    ano,

}) => {
    const sql = `SELECT * FROM horarios WHERE id_usuarios = '${id_usuario}' AND dia = '${dia}' AND mes = '${mes}' AND ano = '${ano}' `
    const horario = await bd.query(sql)

    if(horario[0].length > 0){
        const sql2 = `UPDATE horarios SET hora_entrada = '${hora}' WHERE id_usuarios = '${id_usuario}' AND dia = '${dia}' AND mes = '${mes}' AND ano = '${ano}'`
        const horario2 = await bd.query(sql2)

        return true
    }
        const sql1 = `INSERT INTO horarios(data, id_usuarios, dia, mes, ano, entrada, saida, hora_entrada) VALUES('${data}', '${id_usuario}', '${dia}', '${mes}', '${ano}' , 1, 0, '${hora}')`
        const horario1 =  await bd.query(sql1)

        return true
}


const upHorarioSaida = async ({
    id_usuario,
    hora_saida,
    ano,
    mes,
    dia
}) => {
    const sql1 = `SELECT * FROM horarios WHERE id_usuarios = '${id_usuario}' AND dia = '${dia}' AND mes = '${mes}' AND ano = '${ano}'`
    const horario1 = await bd.query(sql1)


    if(horario1[0].length < 1){
        return false
    }

    const sql = `UPDATE horarios SET hora_saida = '${hora_saida}', saida = '1' WHERE id_usuarios = '${id_usuario}' AND ano = '${ano}' AND mes = '${mes}' AND dia = '${dia}'`
    const horario = await bd.query(sql)

    return true
}

const getHorariosAno = async ({
    id_usuario,
    ano
}) => {
    const sql = `SELECT * FROM horarios WHERE id_usuarios = '${id_usuario}' AND ano = '${ano}'`
    const [horario] = await bd.query(sql)

    return horario
}

const getHorariosIdUser = async (id_usuario) => {
    const sql = `SELECT * FROM horarios WHERE id_usuarios = '${id_usuario}'`
    const [horario] = await bd.query(sql);

    return horario
}

const getHorariosHistorico = async ({
    id_usuario,
    ano,
    mes
}) => {
    const sql = `SELECT * FROM horarios WHERE id_usuarios = '${id_usuario}' AND ano = '${ano}' AND mes = '${mes}'`
    const [horario] = await bd.query(sql)

    return horario
}

const verificarRegistro = async ({
    id_usuario,
    dia,
    mes,
    ano
}) => {
    const sql = `SELECT * FROM horarios JOIN usuarios ON horarios.id_usuarios = usuarios.matricula WHERE  id_usuarios = '${id_usuario}' AND ano = '${ano}' AND mes = '${mes}' AND dia = '${dia}'`
    const [horario] = await bd.query(sql)

    return horario
}




module.exports = {
    createHorario,
    getHorariosIdUser,
    verificarRegistro,
    editHorarios,
    upHorarioSaida,
    getHorariosHistorico,
    getHorariosAno
}