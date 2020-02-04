"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify = require("restify");
const environment_1 = require("../common/environment");
const mongoose = require("mongoose");
class Server {
    /*inicialização do serviço do banco de dados, a requisição pelo banco a ser utilizado é buscada pela
    variável environment onde há a url do banco para a conexão*/
    initializeDb() {
        mongoose.Promise = global.Promise;
        return mongoose.connect(environment_1.environment.db.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }
    /*responsável pela inicialização das rotas que a aplicação contém, mais as suas configurações
     inciais para um bom funcionamento */
    initRoutes(routers) {
        return new Promise((resolve, reject) => {
            try {
                const options = {
                    name: 'dito-challenge-api',
                    version: '1.0.0'
                };
                this.application = restify.createServer(options);
                this.application.use(restify.plugins.queryParser());
                this.application.use(restify.plugins.bodyParser());
                //routes
                for (let router of routers) {
                    router.applyRoutes(this.application);
                }
                this.application.listen(environment_1.environment.server.port, () => {
                    resolve(this.application);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    /* deve ser chamado para a inicialização do servidor */
    bootstrap(routers = []) {
        return this.initializeDb().then(() => this.initRoutes(routers).then(() => this));
    }
    /* em caso de necessidade de derrubar o servidor, deve ser chamado */
    shutdown() {
        return mongoose.disconnect().then(() => this.application.close());
    }
}
exports.Server = Server;
