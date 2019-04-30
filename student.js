/* Model student (datoteka student.js):
-id
-imePrezime : Sequelize.STRING
-index : Sequelize.STRING, unique */

const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
    const student = sequelize.define('student', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        imePrezime: Sequelize.STRING,
        index: {
            type: Sequelize.STRING, 
            unique: true
        } 
    });
    return student;
}