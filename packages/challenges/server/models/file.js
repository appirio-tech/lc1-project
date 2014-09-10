'use strict';
/**
* Defining File model
*/
module.exports = function(sequelize, DataTypes) {
  var File = sequelize.define('File', {
    title : {
      type: DataTypes.TEXT,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    filePath : DataTypes.TEXT,
    tempPath : DataTypes.TEXT,
    size : DataTypes.BIGINT,
    fileName : DataTypes.TEXT,
    storageType : {
      type: DataTypes.INTEGER,
      validate: {
        notNull: true,
        notEmpty: true
      }
    }
    }, {
      tableName : 'files',
      associate : function(models) {
        File.belongsTo(models.Challenge, {foreignKey : 'challengeId'});
      }
    });

  return File;

};