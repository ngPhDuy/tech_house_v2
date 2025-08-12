import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import pg from "pg";

dotenv.config();

const username = process.env.POSTGRES_USER;
const host = process.env.POSTGRES_HOST;
const password = process.env.POSTGRES_PASSWORD;
const dbName = process.env.POSTGRES_DATABASE;
const timezone = process.env.DB_TIMEZONE;

const sequelize = new Sequelize(dbName, username, password, {
  host,
  timezone,
  dialect: "postgres",
  define: {
    timestamps: false,
  },
  dialectModule: pg,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: console.log,
});

export default sequelize;
