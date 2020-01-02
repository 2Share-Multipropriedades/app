const db = require('./config_banco')

const Estado = db.sequelize.define('promo_estado', {
    // attributes
    estado: {
        type: db.Sequelize.STRING,
    }
});

module.exports = Estado;

//Cria a tabela
//Estado.sync()