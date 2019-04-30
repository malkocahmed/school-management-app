/* Model vjezba (datoteka vjezba.js):
-id
-naziv : Sequelize.STRING, unique
-spirala : Sequelize.BOOLEAN */

const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
    const vjezba = sequelize.define('vjezba', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        naziv: {
            type: Sequelize.STRING, 
            unique: true
        },
        spirala: Sequelize.BOOLEAN
    });
    return vjezba;
}