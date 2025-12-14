import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Sweet } from "./entity/Sweet"; 

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true, // Auto-creates tables (dev only)
    logging: false,
    entities: [User, Sweet],
    migrations: [],
    subscribers: [],
});