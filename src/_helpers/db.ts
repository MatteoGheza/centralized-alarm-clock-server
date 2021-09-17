import "reflect-metadata";
import { createConnection } from "typeorm";
import { logger } from "./logger";
import path from "path";

export var connection = undefined;

export function initializeDB(){
    createConnection({
        type: "sqlite",
        database: "server.db",
        entities: [
            path.join(__dirname, "..", "entity", "*.ts")
        ],
        synchronize: true,
        logging: false
    }).then((new_connection) => {
        logger('Initialized db connection', 'verbose');
        connection = new_connection;
    }).catch(error => {
        throw error;
    });
}
