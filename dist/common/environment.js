"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//variável com algumas configurações padrão para ser utilizada durante o desenvolvimento
exports.environment = {
    server: {
        port: process.env.SERVER_PORT || 1000
    },
    db: {
        url: process.env.DB_URL || 'mongodb://localhost/dito-api'
    }
};
