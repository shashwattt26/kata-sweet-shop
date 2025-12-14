import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true, // Auto-creates tables (dev only)
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
});