"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server/server");
const sales_router_1 = require("./sales/sales.router");
const data_collect_router_1 = require("./data_collect/data_collect.router");
//inicializa uma variável para o servidor
const server = new server_1.Server();
//inicia o servidor passando as suas rotas
server.bootstrap([
    sales_router_1.salesRouter,
    data_collect_router_1.dataCollectRouter
]).then(server => {
    console.log('Server is listening on: ', server.application.address());
}).catch(error => {
    console.log('Server failed to start');
    console.log(error);
    process.exit(1);
});
