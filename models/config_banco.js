const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    'timeshare+',                 //nome do banco
    'bigvci',                 //usuário
    'X@mbinh01535', {
    schema: 'vci',              //senha
    host: '192.168.174.14',
    dialect: 'postgres'         //muda de acordo com o banco utilizado 
});
//Duvidas olhar aqui =>
//https://sequelize.org/

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}