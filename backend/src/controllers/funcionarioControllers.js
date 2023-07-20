const modelsFuncionario = require("../models/funcionarioModels");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

const createFuncionario = async (req, res) => {
    const saltRounds = 10;
    const senha = req.body.senha
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(senha, salt)
    req.body.senha = hash

    const usuario = await modelsFuncionario.createFuncionario(req.body);

    if (!usuario) return res.status(200).json({
        mensagem: false
    });
    res.status(200).json({
        mensagem: true
    });
}

const getAllFuncionario = async (req, res) => {
    const usuario = await modelsFuncionario.getAllFuncionario();

    return res.status(200).json(usuario);
}

const getIdFuncionario = async (req, res) => {
    const usuario = await modelsFuncionario.getIdFuncionario(req.params.id);

    return res.status(200).json(usuario);
}

const deleteFuncionario = async (req, res) => {
    const usuario = await modelsFuncionario.deleteFuncionario(req.params.id);

    return res.status(200).json({
        mensagem: true
    });

}

const setFuncionario = async (req, res) => {
    const saltRounds = 10;
    const senha = req.body.senha
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(senha, salt)
    req.body.senha = hash

    const usuario = await modelsFuncionario.setFuncionario(req.params.id, req.body);

    return res.status(200).json({
        mensagem: true
    });
}

const login = async (req, res) => {
    const dados = await modelsFuncionario.login(req.body);

    if (dados == false) return res.status(200).json({
        mensagem: false,
        erro: 'Matricula não estra registada'
    });

    bcrypt.compare(dados.senhaUser, dados.senha, function (err, result) {
        if(err){
            return res.status(200).json({
                mensagem:false,
                erro:'Senha incorreta'
            })
        }
        if (result) {
            const info = {
                id: dados.matricula,
                adm:dados.adm
            }
            const segredo = '349ur309r039ir93i'
            const token = jwt.sign(info, segredo, {
                expiresIn: '12h'
            });
            return res.status(200).json({
                token: token,
                nome:dados.nome,
                mensagem: true
            })

        }
        return res.status(200).json({
            mensagem: false,
            erro: 'Senha incorreta'
        });
    })

}

module.exports = {
    createFuncionario,
    getAllFuncionario,
    getIdFuncionario,
    deleteFuncionario,
    setFuncionario,
    login
}