'use strict';
/**
* Defining Challenge model
*/
module.exports = function(sequelize, DataTypes) {

  var Challenge = sequelize.define('Challenge', {
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
    }, {
      tableName : 'challenges',
      associate : function(models) {
        Challenge.hasMany(models.File);
      }
    });

  return Challenge;

};
