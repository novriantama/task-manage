const { DataTypes } = require("sequelize");
const seq = require("../util/database");

const assignTask = seq.define("assignTask", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
});

module.exports = assignTask;
