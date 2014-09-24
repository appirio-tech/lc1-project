/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';

/**
* Defining Tag model
*/
module.exports = function(sequelize, DataTypes) {

  var Tag = sequelize.define('Tag', {
    name:     DataTypes.STRING(32),
    tag_type: DataTypes.STRING(32)
  }, {tableName: 'tags'});

  return Tag;
};