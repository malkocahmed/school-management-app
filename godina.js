/* Model godina (datoteka godina.js):
-id
-naziv : Sequelize.STRING, unique
-nazivRepSpi : Sequelize.STRING
-nazivRepVje : Sequelize.STRING */

const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
    const godina = sequelize.define('godina', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nazivGod: {
            type: Sequelize.STRING,
            unique: true
        },
        nazivRepVje: Sequelize.STRING,
        nazivRepSpi: Sequelize.STRING
    });
    return godina;
}