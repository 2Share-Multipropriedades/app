const db = require('./config_banco')

//Informações do Parceiro
const Parceiro = db.sequelize.define('promo_parceiro', {
    // attributes
    nome: {
        type: db.Sequelize.STRING,
    },
    id_cidade: {
        type: db.Sequelize.INTEGER,
        references: {         
            model: 'promo_cidades',
            key: 'id'
        }
    },
    id_estado: {
        type: db.Sequelize.INTEGER,
        references: {         
            model: 'promo_estados',
            key: 'id'
        }
    }
});

module.exports = Parceiro;

//Cria a tabela
//Parceiro.sync()