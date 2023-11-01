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
const estruturaAusencia = require("../config/estruturaAusencia")
const FuncionarioBd = require("../bd/FuncionarioBd")
const AusenciaBd = require("../bd/AusenciaBd")
const HorarioBd = require("../bd/HorarioBd")


//exluir usuarios e trocar senha dos usuarios
routes.get("/usuarios", online, (req, res) => {
        FuncionarioBd.getFuncionarios().then(dados => {
        const funcionario = dados.data
        res.render("./admin/usuarios.hbs", {
            dados: funcionario,
            user: req.session.user,
            adm: req.session.adm,
            sucesso: req.flash('sucesso') || null,
            erro: req.flash('erro') || null,
            usuarios: true
        })
    })
})

routes.get("/horarios", online, (req, res) => {
    AusenciaBd.verificar().then(dados => {
        const ausencia = dados.data
        FuncionarioBd.getFuncionarios().then(dados => {
            const funcionario = dados.data
            const funcionarioAusentes =  estruturaAusencia(ausencia)
           
            res.render("./admin/horarios.hbs", {
                usersAusencia: funcionario,
                dadosAusencia: funcionarioAusentes,
                user: req.session.user,
                adm: req.session.adm,
                sucesso: req.flash('sucesso') || null,
                erro: req.flash('erro') || null,
                hora: true
            })
        })
    })

})

routes.post("/editar-horario", (req, res) => {
    const data = new Date(req.body.data)
    const dia = data.getDate() + 1
    const mes = data.getMonth() + 1
    const ano = data.getFullYear()
    const newData = dia + "/" + mes + "/" + ano
    const id_usuario = req.body.id
    var opcao = req.body.opcao
    const hora = req.body.hora

    switch (opcao) {
        case 'entrada':
            opcao = true
            break;
        case 'saida':
            opcao = false
            break;
        default:
            req.flash('erro', 'Métodos de ausencia não foram selecionados Entrada/Saída')
            return res.redirect('/PoloUAB/adm/horarios')
    }

    if (opcao) {
         HorarioBd.editar_horarios( dia, mes, ano, hora, newData, id_usuario).then(dados => {
            const {
                data
            } = dados
            if (data.mensagem) {
                req.flash('sucesso', 'Horario editado!')
                return res.redirect('/PoloUAB/adm/horarios')
            }
        })
    }

    if (!opcao) {
        console.log(true)
        HorarioBd.editar_horarios_saida(dia, mes, ano, hora, id_usuario).then(dados => {
            const {
                data
            } = dados
            if (data.mensagem) {
                req.flash('sucesso', 'Horario editado!')
                return res.redirect('/PoloUAB/adm/horarios')
            }

            req.flash('erro', 'Registro não encontrado')
            return res.redirect('/PoloUAB/adm/horarios')
        })
    }


})

routes.post("/ausencia", (req, res) => {
    var data_entrada = req.body.entrada.split('-')
    data_entrada = data_entrada[2] + '/' + data_entrada[1] + '/' + data_entrada[0]
    var data_saida = req.body.saida.split('-')
    data_saida = data_saida[2] + '/' + data_saida[1] + '/' + data_saida[0]
    const id_usuario = req.body.id
    const {
        opcao
    } = req.body

    var ferias
    var atestado
    switch (opcao) {
        case 'ferias':
            ferias = 1
            atestado = 0
            break;
        case 'atestado':
            ferias = 0
            atestado = 1
            break;
        default:
            req.flash('erro', 'Métodos de ausencia não foram selecionados Férias/Atestado')
            return res.redirect('/PoloUAB/adm/horarios')
    }

    AusenciaBd.createAusencia(
        data_entrada,
        data_saida,
        id_usuario,
        ferias,
        atestado
    ).then(dados => {
        const {
            data
        } = dados

        if (data.mensagem) {
            req.flash('sucesso', 'Férias de ' + data.ausencia[0].nome_completo + ' registrada com sucesso!')
            return res.redirect('/PoloUAB/adm/horarios')
        }

        req.flash('erro', 'erro ao registrar férias')
        return res.redirect('/PoloUAB/adm/horarios')
    })
})

routes.get("/historico/:id", online, (req, res) => {
    HorarioBd.historicoAdm(req.params.id).then(dados => {
        const {
            data
        } = dados
        if (data.length < 1) {
            return res.render("./admin/historicoFuncionario", {
                registro: true,
                user: req.session.user,
                adm: req.session.adm,
                usuarios: true
            })
        }
        const date = new Date()
        const anoAtual = req.query.ano || date.getFullYear()
        const mesAtual = req.query.mes || date.getMonth() + 1
        const ano = estruturaAno(data, anoAtual)
        const mes = estruturaMes(mesAtual)
        HorarioBd.historico(req.params.id, mesAtual, anoAtual).then(dados => {
            const horarios = dados.data
            const estruturaMesVar = estruturaDia(horarios, anoAtual, mesAtual)
            res.render("./funcionario/historico.hbs", {
                ano: ano,
                mes: mes,
                dados: estruturaMesVar,
                registro: horarios.length == 0 ? false : true,
                user: req.session.user || null,
                adm: req.session.adm || null,
                usuarios: true
            })
        })
    })
})

routes.get('/senha/:id', online, (req, res) => {
    res.render("./admin/senha", {
        user: req.session.user,
        adm: req.session.adm,
        usuarios: true
    })
})
routes.post('/senha/:id', online, (req, res) => {

    FuncionarioBd.upFuncionario(req.params.id, req.body.senha).then(dados => {
        const funcionario  = dados.data
        if (funcionario.mensagem) {
            req.flash('sucesso', 'Senha Modificada!')
            return res.redirect("/PoloUAB/adm/usuarios")
        }
        req.flash('erro', 'Erro ao modificar senha')
        return res.redirect("/PoloUAB/adm/usuarios")
    })
})

/*
routes.get('/excluir/:id', online, (req, res) => {
    axios.delete('http://192.168.88.15:2000/api/funcionario/' + req.params.id, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(dados => {
        const {
            data
        } = dados
        if (data.mensagem) {
            req.flash('sucesso', 'Usuário excluído!')
            return res.redirect('/PoloUAB/adm/usuarios')
        }
    })
})
*/

routes.get("/home", online, (req, res) => {
    res.render("./admin/home.hbs", {
        user: req.session.user,
        adm: req.session.adm,
        sucesso: req.flash('sucesso') || null,
        erro: req.flash('erro') || null,
        menu: true
    })
})



module.exports = routes