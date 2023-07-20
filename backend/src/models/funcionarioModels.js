const bd = require("./bd")



const createFuncionario = async ({
    nome_completo,
    senha,
    matricula
}) => {
    const sql2 = `SELECT * FROM usuarios WHERE matricula = ${matricula}`
    const [resul] = await bd.query(sql2)
    if(resul.length > 0){
        return false;
    }

    const usuario = {
        nome_completo: nome_completo,
        senha: senha,
        matricula: matricula
    }
    const sql = `INSERT INTO usuarios(nome_completo, senha, matricula) VALUES('${usuario.nome_completo}', '${usuario.senha}', '${usuario.matricula}')`
    const [resultado] = await bd.query(sql);

    return true;
}

const getAllFuncionario = async () => {
    const sql = "SELECT * FROM usuarios"
    const usuario = await bd.query(sql);

    return usuario
}

const getIdFuncionario = async (matricula) => {
    const sql = `SELECT * FROM usuarios WHERE matricula = '${matricula}'`
    const [usuario] = await bd.query(sql)
    return usuario
}

const deleteFuncionario = async (matricula) => {
    const sql = `DELETE FROM usuarios WHERE matricula = '${matricula}' `
    const usuario = bd.query(sql)

    return usuario
}

const setFuncionario = async (matricula, {
    nome_completo,
    senha,
}) => {

    const sql = `UPDATE usuarios SET  nome_completo = '${nome_completo}', senha = '${senha}', matricula = '${matricula}' WHERE matricula = '${matricula}' `
    const usuario = await bd.query(sql);

    return usuario;
}

const login = async ({
    matricula,
    senha
}) => {
    const sql = `SELECT * FROM usuarios WHERE matricula = '${matricula}'`;
    const [resultMatricula] = await bd.query(sql)
    if (resultMatricula.length <= 0) return false;
    return {
        nome:resultMatricula[0].nome_completo,
        matricula: resultMatricula[0].matricula,
        adm:resultMatricula[0].adm,
        senha: resultMatricula[0].senha,
        senhaUser: senha
    }
}

module.exports = {
    createFuncionario,
    getAllFuncionario,
    getIdFuncionario,
    deleteFuncionario,
    setFuncionario,
    login
}