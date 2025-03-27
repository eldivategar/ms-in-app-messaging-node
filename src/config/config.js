require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql"
  },
  test: {
    username: "test",
    password: "test",
    database: "test",
    host: "test",
    dialect: "mysql"
  },
  production: {
    username: "test",
    password: "test",
    database: "test",
    host: "test",
    dialect: "mysql"
  }
}
