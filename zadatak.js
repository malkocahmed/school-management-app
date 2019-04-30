/* Model zadatak (datoteka zadatak.js):
-id
-naziv : Sequelize.STRING
-postavka : Sequelize.STRING */

const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
    const zadatak = sequelize.define('zadatak', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        naziv: Sequelize.STRING,
        postavka: Sequelize.STRING
    });
    return zadatak;
}