"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Session extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Session.hasOne(models.User);
    }
  }
  Session.init(
    {
      sid: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      expire: DataTypes.DATE,
      sess: DataTypes.JSON,
    },
    {
      sequelize,
      modelName: "Session",
      hooks:{
        // beforeUpsert: (session, options)=>{

        //   console.log("before upsert hook", session, "oppts ", options);
        // },
        // beforeCreate: (instance, options)=>{
        //   console.log("before create hook", instance);
        // }
      }
    }
  );
  return Session;
};
