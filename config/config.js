require("dotenv").config({ path: __dirname + "/../.env" });
module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
    // define: {
    //   underscored: true,
    //   createdAt: "created_at",
    //   updatedAt: "updated_at",
    //   deletedAt: "deleted_at",
    // },
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: "root",
    password: null,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};
