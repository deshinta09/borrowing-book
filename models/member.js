"use strict";
const { Model } = require("sequelize");
const { hashedPassword } = require("../helpers/bcrypt");
module.exports = (sequelize, DataTypes) => {
  class Member extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Member.hasMany(models.MembersBook, { foreignKey: "MemberId" });
    }
  }
  Member.init(
    {
      code: DataTypes.STRING,
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Name is require" },
          notEmpty: { msg: "Name is require" },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { args: true, msg: "Email must be unique" },
        validate: {
          notNull: { msg: "Email is require" },
          notEmpty: { msg: "Email is require" },
          isEmail: { msg: "Email must be type email" },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Password is require" },
          notEmpty: { msg: "Password is require" },
        },
      },
    },
    {
      sequelize,
      modelName: "Member",
    }
  );
  Member.beforeCreate((member) => {
    const hashedPassword = hashedPassword(member.password);
    member.password = hashedPassword;
  });
  return Member;
};
