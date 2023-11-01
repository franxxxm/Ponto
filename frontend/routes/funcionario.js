const {
    default: axios
} = require("axios");
const routes = require("express").Router();
const jwt = require('jsonwebtoken');
const online = require("../middlewares/rotaOnline")
const offline = require("../middlewares/rotaOffline")
const estruturaAno = require('../config/estruturaAno')
const estruturaDia = require("../config/estruturaDia")
const estruturaMes = require("../config/estruturaMes")
const verificarRegistro = require("../config/verificarRegistro")
const FuncionarioBd = require("../bd/FuncionarioBd");
const HorarioBd = require("../bd/HorarioBd")
const auth = require("../middlewares/auth")

routes.use((req, res, next) => {

    //descodificar o token
    if (req.session.token) {
        const token = req.session.token;
        const tokenDecode = jwt.decode(token, {
            complete: true
        })
        const exp = new Date(tokenDecode.payload.exp * 1000)

        if (Date.now() > exp) {
            delete req.session.user
            delete req.session.token
        }

        if (req.session.user) return next();
        const decoded = jwt.decode(token, {
            complete: true
        });
        const payload = decoded.payload;
        req.session.user = payload.id
        req.session.adm = payload.adm
        if (req.session.adm > 0) {
            req.session.adm = true
        }
    }
    //criar sessão se o usuario ja se registrou hoje 
    if (req.session.entrada) {
        HorarioBd.verificar(req.session.user).then(dados => {
            const horarios = dados.data
            const {
                entrada,
                saida
            } = verificarRegistro(horarios)
            req.session.entrada = entrada
            req.session.saida = saida
        })
    }

    const admNot = ['/registrar-horario']

    if (req.session.adm > 0) {
        if (req.url == admNot[0]) {
            return res.redirect("/PoloUAB/adm/home")
        }
    }
    next();
})



routes.get("/home", online, (req, res) => {
    HorarioBd.verificar(req.session.user).then(dados => {
        const horarios = dados.data
        const {
            registro,
            entrada,
            saida
        } = verificarRegistro(horarios)
        res.render('./funcionario/home.hbs', {
            nome: horarios[0].nome_completo,
            matricula: horarios[0].matricula,
            user: req.session.user,
            adm: req.session.adm,
            registro,
            menu: true,
            entrada,
            saida
        })
    })
})

routes.get("/historico", online, (req, res) => {
    FuncionarioBd.getFuncionarioId(req.session.user).then(dados => {
        const funcionario = dados.data
        if (funcionario.length < 1) {
            return res.render("./funcionario/historico.hbs", {
                registro: false,
                user: req.session.user || null,
                adm: req.session.adm || null,
                historico: true
            })
        }
        const date = new Date()
        const anoAtual = req.query.ano || date.getFullYear()
        const mesAtual = req.query.mes || date.getMonth() + 1
        const ano = estruturaAno(funcionario, anoAtual)
        const mes = estruturaMes(mesAtual)
        HorarioBd.historico(req.session.user, mesAtual, anoAtual).then(dados => {
            const horarios = dados.data
            const estruturaMesVar = estruturaDia(horarios, anoAtual, mesAtual)
            res.render("./funcionario/historico.hbs", {
                ano,
                mes,
                dados: estruturaMesVar,
                registro: horarios.length == 0 ? false : true,
                user: req.session.user || null,
                adm: req.session.adm || null,
                historico: true
            })
        })
    })
})

routes.get("/registrar-horario", online, (req, res) => {
    HorarioBd.verificar(req.session.user).then(dados => {
        const horarios = dados.data
        const {
            registro,
            entrada,
            saida
        } = verificarRegistro(horarios)
        res.render("./funcionario/registrarHorario.hbs", {
            user: req.session.user || null,
            adm: req.session.adm || null,
            registro,
            sucesso: req.flash('sucesso'),
            erro: req.flash('erro'),
            entrada,
            saida,
            hora: true
        })
    })
})


routes.post("/registrar-horario", (req, res) => {
    const botao = req.body.botao
    if (req.session.entrada && botao == 'entrada') {
        return res.redirect("/PoloUAB/registrar-horario")
    }
    if (botao == 'entrada' && req.session.entrada != true) {
        const entrada = req.body.botao == 'entrada' ? 1 : 0
        const saida = req.body.botao == 'saida' ? 1 : 0
        HorarioBd.horarios_entrada(req.session.user, entrada, saida).then(dados => {
            const horarios = dados.data
            if (horarios.mensagem) {
                req.session.entrada = true
                req.flash('sucesso', `Entrada Registrada!`)
                return res.redirect('/PoloUAB/registrar-horario')
            }
            req.flash('erro', `Erro ao Registrar`)
            return res.redirect('/PoloUAB/registrar-horario')
        })

    }

    if (botao == 'saida' && req.session.saida != true) {
        HorarioBd.horarios_saida(req.session.user).then(dados => {
            const horarios = dados.data

            if (horarios.mensagem) {
                req.session.saida = true
                req.flash('sucesso', `Saida Registrada!`)
                return res.redirect('/PoloUAB/registrar-horario')
            }

            req.flash('erro', `Erro ao Registrar`)
            return res.redirect('/PoloUAB/registrar-horario')
        })
    }
})

routes.get("/login", offline, (req, res) => {
    return res.render("./funcionario/login.hbs", {
        login: true,
        erro: req.flash('erro') || null,
        sucesso: req.flash('sucesso') || null
    })

})
routes.post("/login", auth, (req, res) => {})


routes.get("/registro", offline, (req, res) => {
    res.render("./funcionario/registro.hbs", {
        registro: true,
        erro: req.flash('erro')
    })
})

routes.post("/registro", (req, res) => {
    const saltRounds = 10;
    const senha = req.body.senha
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(senha, salt)
    req.body.senha = hash
    FuncionarioBd.creatFuncionario(req.body.matricula, req.body.senha, req.body.nome).then(dados => {
        const {
            data
        } = dados

        if (data.mensagem) {
            req.flash('sucesso', 'Cadastrado com sucesso')
            return res.redirect("/PoloUAB/login")
        }

        if (!data.mensagem) {
            req.flash('erro', 'Essa matricula já esta registrada')
            return res.redirect("/PoloUAB/registro")
        }
        req.flash('erro', 'Cadastro falhou')
        res.redirect("/PoloUAB/registro")
    })
})

routes.get("/sair", (req, res) => {
    delete req.session.token
    delete req.session.user
    delete req.session.adm
    delete req.flash()
    req.flash('sucesso', 'Deslogado com sucesso!')
    return res.redirect("/PoloUAB/login")
})


module.exports = routes