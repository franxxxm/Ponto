const Sequelize = require("sequelize");
const sequelize = new Sequelize('bd_ponto','root',process.env.MYSQL_PASSWORD,{
    host:process.env.MYSQL_HOST,
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