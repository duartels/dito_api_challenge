"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("../common/router");
const axios_1 = require("axios");
const sales_model_1 = require("./sales.model");
class SalesRouter extends router_1.Router {
    constructor() {
        super();
    }
    applyRoutes(application) {
        //rota para acessar a timeline dos documentos adquiridos através da importação
        application.get('/sales/timeline', (req, res, next) => {
            sales_model_1.Sale.find().sort({ "timestamp": -1 }).then(sales => {
                res.json({ "timeline": sales });
                return next();
            });
        });
        //rota que busca os dados na url especificada e realiza a inserção dos arquivos no bando de dados
        application.get('/sales/import', (req, res, next) => {
            let sales = [];
            axios_1.default.get('https://storage.googleapis.com/dito-questions/events.json').then(function (response) {
                //console.log(data.events)
                //dataObj = JSON.parse(data.events)
                response.data.events.forEach(element => {
                    let aux = {};
                    if (element.event == 'comprou') {
                        aux.timestamp = element.timestamp;
                        aux.revenue = element.revenue;
                        aux.transaction_id = element.custom_data.find(item => item.key == 'transaction_id').value;
                        aux.store_name = element.custom_data.find(item => item.key == 'store_name').value;
                        aux.products = [];
                        sales.push(aux);
                    }
                });
                response.data.events.forEach(element => {
                    let aux = {};
                    for (let i = 0; i < sales.length; i++) {
                        if (element.event == 'comprou-produto') {
                            if (sales[i].transaction_id == element.custom_data.find(item => item.key == 'transaction_id').value) {
                                aux.name = element.custom_data.find(item => item.key == 'product_name').value;
                                aux.price = element.custom_data.find(item => item.key == 'product_price').value;
                                sales[i].products.push(aux);
                            }
                        }
                    }
                });
                //console.log(sales[0].products);
                //console.log(sales[1].products);
                //console.log(array)
                let transaction_ids = [];
                sales.forEach(sale => {
                    transaction_ids.push(sale.transaction_id + "");
                });
                sales_model_1.Sale.find({ "transaction_id": transaction_ids }).then(result => {
                    if (result.length > 0) {
                        let existents = [];
                        result.forEach(sale => {
                            existents.push(sale.transaction_id);
                        });
                        res.send(`Já existe(m) documento(s) com 'transaction_id' semelhante(s): ${existents}`);
                        return next();
                    }
                    else {
                        sales_model_1.Sale.collection.insertMany(sales, function (err, docs) {
                            if (err) {
                                res.send(404);
                            }
                            else {
                                res.send(`Total de documento(s) inserido(s): ${docs.insertedCount}`);
                            }
                        });
                        return next();
                    }
                });
            }).catch(function (error) {
                console.log(error);
            });
        });
    }
}
exports.salesRouter = new SalesRouter();
