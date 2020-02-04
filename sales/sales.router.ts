import {Router} from '../common/router'
import * as restify from 'restify'
import axios from 'axios'
import {Sale} from './sales.model'

class SalesRouter extends Router{
    constructor(){
        super()
    }

    applyRoutes(application: restify.Server){
        //rota para acessar a timeline dos documentos adquiridos através da importação
        application.get('/sales/timeline', (req, res, next)=>{
            Sale.find().sort({"timestamp":-1}).then(sales => {
                res.json({"timeline":sales})
                return next()
            })
        })

        //rota que busca os dados na url especificada e realiza a inserção dos arquivos no bando de dados
        application.get('/sales/import', (req, res, next) =>{
            let sales = [];
            axios.get('https://storage.googleapis.com/dito-questions/events.json').then(function(response){
                //console.log(data.events)
                //dataObj = JSON.parse(data.events)
                response.data.events.forEach(element => {
                    let aux = {};
                    if(element.event == 'comprou'){
                        (<any>aux).timestamp = element.timestamp;
                        (<any>aux).revenue = element.revenue;
                        (<any>aux).transaction_id = element.custom_data.find(item => item.key == 'transaction_id').value;
                        (<any>aux).store_name = element.custom_data.find(item => item.key == 'store_name').value;
                        (<any>aux).products = [];
                        sales.push(aux);
                    }
                });
                response.data.events.forEach(element => {
                    let aux = {};
                    for(let i=0; i < sales.length; i++){
                        if(element.event == 'comprou-produto'){
                            if(sales[i].transaction_id == element.custom_data.find(item => item.key == 'transaction_id').value){
                                (<any>aux).name = element.custom_data.find(item => item.key == 'product_name').value;
                                (<any>aux).price = element.custom_data.find(item => item.key == 'product_price').value;
                                sales[i].products.push(aux);
                            }
                        }
                    }
                })
                //console.log(sales[0].products);
                //console.log(sales[1].products);
                //console.log(array)

                let transaction_ids = []
                sales.forEach(sale =>{
                    transaction_ids.push(sale.transaction_id+"")
                })

                Sale.find({"transaction_id":transaction_ids}).then(result =>{
                    if(result.length > 0){
                        let existents = []
                        result.forEach(sale =>{
                            existents.push(sale.transaction_id)
                        })
                        res.send(`Já existe(m) documento(s) com 'transaction_id' semelhante(s): ${existents}`)
                        return next()
                    }else{
                        Sale.collection.insertMany(sales, function(err, docs){
                            if(err){
                                res.send(404);
                            }else{
                                res.send(`Total de documento(s) inserido(s): ${docs.insertedCount}`);
                            }
                        })
                        return next()
                    }
                })         
            }).catch(function(error){
                console.log(error);
            })
        })

    }
}

export const salesRouter = new SalesRouter()