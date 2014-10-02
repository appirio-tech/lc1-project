'use strict';
/**
* Defining Challenge model
*/
module.exports = function(sequelize, DataTypes) {

  var Challenge = sequelize.define('Challenge', {
    createdBy:  DataTypes.STRING(64),
    updatedBy:  DataTypes.STRING(64),
    regStartDate: DataTypes.DATE,
    subEndDate: DataTypes.DATE,
    title: {
      type: DataTypes.STRING(128),
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    status : DataTypes.STRING(32),
    type: DataTypes.STRING(32),
    overview: DataTypes.STRING(140),
    description: DataTypes.TEXT,
    registeredDescription: DataTypes.TEXT,
    tags: DataTypes.ARRAY(DataTypes.TEXT),
    accountId: DataTypes.STRING(32),
    }, {
      tableName : 'challenges',
      associate : function(models) {
        Challenge.hasMany(models.File);
        Challenge.belongsTo(models.Account, {foreignKey: 'accountId'});
      }
    });

 // was Challenge.hasOne(models.Account, {as: 'Account', foreignKey: 'accountId'});

  return Challenge;

};
