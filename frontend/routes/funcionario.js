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

        const data = new Date();
        const dia = data.getDate();
        const mes = data.getMonth() + 1;
        const ano = data.getFullYear();
        axios.post(`http://192.168.88.15:2000/api/verificar`, {
            id_usuario: req.session.user,
            mes: mes,
            dia: dia,
            ano: ano
        }).then(dados => {
            const {
                data
            } = dados
            req.session.entrada = data.entrada
            req.session.saida = data.saida
        })
    }

    next();
})



routes.get("/menu", online, (req, res) => {
    axios.get(`http://192.168.88.15:2000/api/funcionario/${req.session.user}`, {
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(dados => {
        const {
            data
        } = dados
        const date = new Date();
        const dia = date.getDate();
        const mes = date.getMonth() + 1;
        const ano = date.getFullYear();
        axios.post(`http://192.168.88.15:2000/api/verificar`, {
            id_usuario: req.session.user,
            mes: mes,
            dia: dia,
            ano: ano
        }).then(horarios => {
            const data1 = horarios.data
            res.render('./funcionario/menu.hbs', {
                nome: data[0].nome_completo,
                matricula: data[0].matricula,
                user: req.session.user,
                adm: req.session.adm,
                menu: true,
                entrada:data1.entrada,
                saida:data1.saida
            })
        })
    })
})

routes.get("/historico", online, (req, res) => {
    axios.get(`http://192.168.88.15:2000/api/horarios/${req.session.user}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(dados => {
        const {
            data
        } = dados
        if (data.length < 1) {
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
        const ano = estruturaAno(data, anoAtual)
        const mes = estruturaMes(mesAtual)
        axios.post(`http://192.168.88.15:2000/api/historico`, {
            id_usuario: req.session.user,
            mes: mesAtual,
            ano: anoAtual,
        }).then(dados => {
            const {
                data
            } = dados
            const estruturaMesVar = estruturaDia(data, anoAtual, mesAtual)
            res.render("./funcionario/historico.hbs", {
                ano: ano,
                mes: mes,
                dados: estruturaMesVar,
                registro: data.length == 0 ? false : true,
                user: req.session.user || null,
                adm: req.session.adm || null,
                historico: true
            })
        })
    })
})

routes.get("/registrar-Horario", online, (req, res) => {
    const data = new Date();
    const dia = data.getDate();
    const mes = data.getMonth() + 1;
    const ano = data.getFullYear();
    axios.post(`http://192.168.88.15:2000/api/verificar`, {
        id_usuario: req.session.user,
        mes: mes,
        dia: dia,
        ano: ano
    }).then(dados => {
        const {
            data
        } = dados

        res.render("./funcionario/registrarHorario.hbs", {
            user: req.session.user || null,
            adm: req.session.adm || null,
            sucesso: req.flash('sucesso'),
            erro: req.flash('erro'),
            entrada: data.entrada,
            saida: data.saida,
            hora: true,
        })
    })

})


routes.post("/registrar-Horario", (req, res) => {
    const botao = req.body.botao

    if (req.session.entrada && botao == 'entrada') {
        return res.redirect("/PoloUAB/Registrar-Horario")
    }

    if (botao == 'entrada' && req.session.entrada != true) {
        const entrada = req.body.botao == 'entrada' ? 1 : 0
        const saida = req.body.botao == 'saida' ? 1 : 0
        var data = new Date();
        var hora = data.getHours();
        var minutos = data.getMinutes();
        const dia = data.getDate();
        const mes = data.getMonth() + 1;
        const ano = data.getFullYear();
        if (hora < 10) hora = "0" + hora;
        if (minutos < 10) minutos = "0" + minutos;
        var horaAtual = hora + ":" + minutos

        axios.post(`http://192.168.88.15:2000/api/horarios`, {
            entrada: entrada,
            saida: saida,
            hora: horaAtual,
            dia: dia,
            mes: mes,
            ano: ano,
            id_usuario: req.session.user
        }).then(dados => {
            const {
                data
            } = dados

            if (data.mensagem) {
                req.session.entrada = true
                req.flash('sucesso', `Entrada Registrada!`)
                return res.redirect('/PoloUAB/Registrar-Horario')
            }

            req.flash('erro', `Erro ao Regustrar`)
            return res.redirect('/PoloUAB/Registrar-Horario')
        })

    }

    if (botao == 'saida' && req.session.saida != true) {
        var data = new Date();
        var hora = data.getHours();
        var minutos = data.getMinutes();
        const dia = data.getDate();
        const mes = data.getMonth() + 1;
        const ano = data.getFullYear();
        if (hora < 10) hora = "0" + hora;
        if (minutos < 10) minutos = "0" + minutos;
        var horaAtual = hora + ":" + minutos

        axios.post(`http://192.168.88.15:2000/api/horario-saida`, {
            hora_saida: horaAtual,
            dia: dia,
            mes: mes,
            ano: ano,
            id_usuario: req.session.user
        }).then(dados => {
            const {
                data
            } = dados

            if (data.mensagem) {
                req.session.saida = true
                req.flash('sucesso', `Saida Registrada!`)
                return res.redirect('/PoloUAB/Registrar-Horario')
            }

            req.flash('erro', `Erro ao Registrar`)
            return res.redirect('/PoloUAB/Registrar-Horario')
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
routes.post("/login", (req, res) => {
    axios.post(`http://192.168.88.15:2000/api/funcionario/login`, {
        matricula: req.body.matricula,
        senha: req.body.senha
    }).then(dados => {
        const {
            data
        } = dados
        if (data.mensagem) {
            req.flash('sucesso', 'Logado com sucesso ' + data.nome)
            req.session.token = data.token
            return res.redirect("/PoloUAB/Registrar-Horario")
        }
        req.flash('erro', data.erro)
        return res.redirect("/PoloUAB/login")
    })
})


routes.get("/registro", offline, (req, res) => {
    res.render("./funcionario/registro.hbs", {
        registro: true,
        erro: req.flash('erro')
    })
})

routes.post("/registro", (req, res) => {
    const usuario = [
        req.body.senha, req.body.matricula, req.body.nome
    ]
    axios.post(`http://192.168.88.15:2000/api/funcionario`, {
        matricula: usuario[1],
        senha: usuario[0],
        nome_completo: usuario[2]
    }).then(dados => {
        const {
            data
        } = dados

        if (data.mensagem) {
            req.flash('sucesso', 'Cadastrado com sucesso')
            return res.redirect("/PoloUAB/login")
        }

        if (!data.mensagem) {
            console.log('erro')
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