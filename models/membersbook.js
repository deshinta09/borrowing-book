"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MembersBook extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      MembersBook.belongsTo(models.Books, { foreignKey: "BookId" });
      MembersBook.belongsTo(models.Member, { foreignKey: "MemberId" });
    }
  }
  MembersBook.init(
    {
      MemberId: DataTypes.INTEGER,
      BookId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "MembersBook",
    }
  );
  return MembersBook;
};
