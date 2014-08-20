'use strict';

/**
 * Challenge Model
 *
 * title
 * twitter
 * public_desc
 * private_desc
 * start_date
 * end_date
 */
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('challenge', {
    title: DataTypes.TEXT,
    summary: DataTypes.TEXT,
    description: DataTypes.STRING(140),
    protectedDesc: DataTypes.TEXT,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE
  });
};