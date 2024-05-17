const Sequelize = require("sequelize");
require('dotenv').config();
const sequelize = new Sequelize('bd_ponto', process.env.USER, process.env.PASSWORD,{
    host:process.env.HOST,
    port:process.env.PORT,
    dialect:'mysql',
    define:{
        charset:'utf8',
        callate: 'utf8_general_ci',
        timestamps: true
    }, 
    logging:false
})
/*
sequelize.authenticate().then(()=>{
    console.log("conectado com sucesso")
}).catch((erro)=>{
    console.log("erro ao conectar "+ erro)
})
*/
module.exports =  sequelize;