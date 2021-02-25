const Sequelize = require('sequelize');

const seq = new Sequelize({
    dialect: 'sqlite',
    storage: './util/databases.sqlite'
  });

module.exports = seq;