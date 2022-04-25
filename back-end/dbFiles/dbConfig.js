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
