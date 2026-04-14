import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const dbConfig: sql.config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || "localhost",
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT) || 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

export const connectDB = async () => {
  try {
    const pool = await sql.connect(dbConfig);
    console.log("Conectado a SQL Server ✅");
    return pool;
  } catch (error) {
    console.error("Error al conectar a SQL Server ❌", error);
    throw error;
  }
};

export default sql;