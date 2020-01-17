const db = require('./config_banco')

//Informações do Parceiro
const Lead = db.sequelize.define('promo_lead', {
    // attributes
    nome: {
        type: db.Sequelize.STRING,
    },
    celular: {
        type: db.Sequelize.STRING,
    },
    id_promoter: {
        type: db.Sequelize.INTEGER,
        references: {
            model: 'promo_promoters',
            key: 'id_crm'
        }
    },
    id_parceiro: {
        type: db.Sequelize.INTEGER,
        references: {
            model: 'promo_parceiros',
            key: 'id'
        }
    },
    promoter_crm:{
        type: db.Sequelize.INTEGER
    },
    promoter_nome:{
        type: db.Sequelize.STRING
    },
    cidade:{
        type: db.Sequelize.STRING
    },
    estado:{
        type: db.Sequelize.STRING
    },
    status:{
        type: db.Sequelize.STRING
    }
});

module.exports = Lead;

//Cria a tabela
//Lead.sync()