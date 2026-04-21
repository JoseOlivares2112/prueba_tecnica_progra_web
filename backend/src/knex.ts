import knex from "knex";

export const db = knex({
  client: "mssql",
  connection: {
    host: process.env.DB_SERVER || "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: Number(process.env.DB_PORT) || 1433,
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
  },
});