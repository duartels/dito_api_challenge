import {Server} from './server/server'
import {salesRouter} from './sales/sales.router';
import {dataCollectRouter} from './data_collect/data_collect.router'

//inicializa uma variável para o servidor
const server = new Server()

//inicia o servidor passando as suas rotas
server.bootstrap([
    salesRouter,
    dataCollectRouter
]).then(server=>{
    console.log('Server is listening on: ', server.application.address())
}).catch(error => {
    console.log('Server failed to start')
    console.log(error)
    process.exit(1)
})
