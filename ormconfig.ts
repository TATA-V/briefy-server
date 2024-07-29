import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();
const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/**/migrations/*.js'],
  migrationsTableName: 'migrations',
});
