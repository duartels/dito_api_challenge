import * as fs from 'fs'
import * as restify from 'restify'
import {environment} from '../common/environment'
import {Router} from '../common/router'
import * as mongoose from 'mongoose'


export class Server{

    application: restify.Server

    /*inicialização do serviço do banco de dados, a requisição pelo banco a ser utilizado é buscada pela
    variável environment onde há a url do banco para a conexão*/
    initializeDb(){
        (<any>mongoose).Promise = global.Promise
        return mongoose.connect(environment.db.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    }

    /*responsável pela inicialização das rotas que a aplicação contém, mais as suas configurações
     inciais para um bom funcionamento */
    initRoutes(routers: Router[]): Promise<any>{
        return new Promise((resolve, reject)=>{
            try {

                const options: restify.ServerOptions = {
                    name: 'dito-challenge-api',
                    version: '1.0.0'
                }

                this.application = restify.createServer(options)

                this.application.use(restify.plugins.queryParser())
                this.application.use(restify.plugins.bodyParser())

                //routes
                for(let router of routers){
                    router.applyRoutes(this.application)
                }

                this.application.listen(environment.server.port, ()=>{
                    resolve(this.application)
                })

            } catch (error) {
                reject(error)
            }
        })
    }

    /* deve ser chamado para a inicialização do servidor */
    bootstrap(routers: Router[] = []): Promise<Server>{
        return this.initializeDb().then(() => 
               this.initRoutes(routers).then(()=> this))
    }

    /* em caso de necessidade de derrubar o servidor, deve ser chamado */
    shutdown(){
        return mongoose.disconnect().then(()=>this.application.close())
    }
}