const db = require('./config_banco')

//Informações dx Promoter no local
const Registro = db.sequelize.define('promo_registro', {
    //colunas
    promoter_nome:{
        type: db.Sequelize.STRING
    },
    id_promoter: {
        type: db.Sequelize.INTEGER,
        references: {
            model: 'promo_promoters',
            key: 'id'
        }
    },
    id_parceiro: {
        type: db.Sequelize.INTEGER,
        references: {
            model: 'promo_parceiros',
            key: 'id'
        }
    },
    status: {
        type: db.Sequelize.STRING
    }
});

module.exports = Registro;

//Cria a tabela
//Registro.sync()