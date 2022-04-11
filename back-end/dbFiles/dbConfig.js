// const dotenv = require("dotenv");

// const USER = process.env.SQL_USER;
// const PASSWORD = process.env.SQL_PASSWORD;
// const DATABASE = process.env.SQL_DATABASE;
// const SERVER = process.env.SQL_SERVER;

// dotenv.config();

const dbConfig = {
  user: "sa",
  password: "root",
  server: "localhost",
  database: "UGPTIAuth",
  options: {
    trustedConnecttrustServerCertificate: true,
    trustedConnection: false,
    enableArithAbort: true,
    instancename: "DESKTOP-3MTTOCS",
    encrypt: false,
  },
  port: 1433,
};

module.exports = dbConfig;
