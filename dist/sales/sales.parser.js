"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
exports.importSales = () => {
    return (req, res, next) => {
        let products = initImport();
        if (products != undefined) {
            console.log(products);
        }
        else {
            console.log('deu ruim');
            next();
        }
    };
};
function initImport() {
    axios_1.default.get('https://storage.googleapis.com/dito-questions/events.json').then(function (response) {
        getSales(response.data);
    });
}
function getSales(data) {
    let array = [];
    //console.log(data.events)
    //dataObj = JSON.parse(data.events)
    data.events.forEach(element => {
        let aux = {};
        if (element.event == 'comprou') {
            aux.timestamp = element.timestamp(aux).revenue = element.revenue(aux).transaction_id = element.custom_data.find(item => item.key == 'transaction_id').value(aux).store_name = element.custom_data.find(item => item.key == 'store_name').value(aux).products = [];
            array.push(aux);
        }
    });
    getSalesProducts(array, data);
}
function getSalesProducts(array, data) {
    data.events.forEach(element => {
        let aux = {};
        for (let i = 0; i < array.length; i++) {
            if (element.event == 'comprou-produto') {
                if (array[i].transaction_id == element.custom_data.find(item => item.key == 'transaction_id').value) {
                    aux.name = element.custom_data.find(item => item.key == 'product_name').value(aux).price = element.custom_data.find(item => item.key == 'product_price').value;
                    array[i].products.push(aux);
                }
            }
        }
    });
    console.log(array[0].products);
    console.log(array[1].products);
    return array;
}
