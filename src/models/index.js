'use strict';

const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const process = require('process');
const configData = require('../config/database');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = configData[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Initialize models
const modelFiles = fs.readdirSync(__dirname).filter(file => {
  return (
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.slice(-9) === '.model.js' &&
    file.indexOf('.test.js') === -1
  );
});

// Load all models synchronously
modelFiles.forEach(file => {
  const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
});

// Set up associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Add timestamps to all models
Object.keys(db).forEach(modelName => {
  if (db[modelName].options.timestamps !== false) {
    db[modelName].options.timestamps = true;
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
