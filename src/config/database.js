require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
  },
  test: {
    username: "test",
    password: "test",
    database: "test",
    host: "test",
    dialect: "postgres"
  },
  production: {
    username: "test",
    password: "test",
    database: "test",
    host: "test",
    dialect: "postgres"
  }
}
