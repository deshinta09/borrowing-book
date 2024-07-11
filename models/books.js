"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Books extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Books.hasMany(models.MembersBook, { foreignKey: "BookId" });
    }
  }
  Books.init(
    {
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Name is require" },
          notEmpty: { msg: "Name is require" },
        },
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Name is require" },
          notEmpty: { msg: "Name is require" },
        },
      },
      author: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Name is require" },
          notEmpty: { msg: "Name is require" },
        },
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Name is require" },
          notEmpty: { msg: "Name is require" },
        },
      },
    },
    {
      sequelize,
      modelName: "Books",
    }
  );
  return Books;
};
