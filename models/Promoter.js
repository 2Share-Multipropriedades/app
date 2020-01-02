const db = require('./config_banco')

//Informações dx Promoter
const Promoter = db.sequelize.define('promo_promoter', {
    //colunas
    nome: {
        type: db.Sequelize.STRING
    },
    email: {
        type: db.Sequelize.STRING
    },
    senha: {
        type: db.Sequelize.STRING
    },
    id_crm:{
        type: db.Sequelize.INTEGER
    }
});

module.exports = Promoter;

//Cria a tabela
//Promoter.sync()