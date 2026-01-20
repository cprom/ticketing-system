import sql from 'mssql';


const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),    
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

export {
  sql,
  pool,
  poolConnect
};