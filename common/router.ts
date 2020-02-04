import * as restify from 'restify'

/*todo arquivo de rota deve implementar o applyRoutes, para ser possível o servidor encontrar essas rotas
 e as tornarem disponíveis dentro da aplicação*/
export abstract class Router{
    abstract applyRoutes(application: restify.Server)
}