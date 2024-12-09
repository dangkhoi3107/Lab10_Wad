import { Sequelize } from 'sequelize'; // ORM
import dotenv from 'dotenv';

dotenv.config() // Load variable from .env

const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE_NAME,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        dialect: 'mysql',
        logging: console.log // You can disable logging by setting false
    }
);

export default sequelize;