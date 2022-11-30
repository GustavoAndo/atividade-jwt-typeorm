import { DataSource } from "typeorm";
import * as dotenv from 'dotenv';
dotenv.config();

const AppDataSource = new DataSource({
    // url: process.env.DB_URL,
    // host: 'localhost',
    // port: 5432,
    // username: 'postgres',
    // password: 'fatec',
    // database: 'atividade',
    // type: "postgres",
    database: "bdaula.db",
    type: "sqlite",
    synchronize: false,
    logging: false,
    entities: ["src/entities/*.ts"],
    migrations: ["src/migrations/*.ts"], 
    subscribers: [],
    maxQueryExecutionTime: 2000 // 2 seg.
});

AppDataSource
    .initialize()
    .then(() => {
        console.log("Data Source inicializado!")
    })
    .catch((e) => {
        console.error("Erro na inicialização do Data Source:", e)
    });

export default AppDataSource;