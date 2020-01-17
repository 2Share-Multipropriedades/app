const db = require('./config_banco')

//Informações do Parceiro
const Cidade = db.sequelize.define('promo_cidade', {
    // attributes
    cidade: {
        type: db.Sequelize.STRING,
    },
    ddd_cidade: {
        type: db.Sequelize.STRING
    },
    id_estado: {
        type: db.Sequelize.INTEGER,
        references: {
            model: 'promo_estados',
            key: 'id'
        }
    }
});

module.exports = Cidade;

//Cria a tabela
//Cidade.sync()