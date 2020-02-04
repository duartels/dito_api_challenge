"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("../common/router");
const data_collect_model_1 = require("./data_collect.model");
const mongoose = require("mongoose");
const restify_errors_1 = require("restify-errors");
class DataCollectRouter extends router_1.Router {
    constructor() {
        super();
        //responsável para validar se o id passado na requisição é um id válido pelo mongodb
        this.validateId = (req, res, next) => {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                next(new restify_errors_1.NotFoundError('Documento não encontrado!'));
            }
            else {
                next();
            }
        };
    }
    applyRoutes(application) {
        /*rota que retorna todos os dados encontrados e também pode ser passado um termo na rota para
        que seja realizado o autocomplete, que é a ideia principal da atividade proposta. */
        application.get('/autocomplete', (req, res, next) => {
            if (req.getQuery()) {
                if (req.query.event != undefined) {
                    data_collect_model_1.DataCollect.find({ "event": new RegExp(req.query.event) }).then(datas => {
                        res.json(datas);
                    }).catch(next);
                }
                else {
                    res.json({ message: "Favor passar o termo da query como 'event'. Exemplo: http://localhost:3000/autocomplete?event=bu" });
                }
                return next();
            }
            else {
                data_collect_model_1.DataCollect.find().then(datas => {
                    res.json(datas);
                    return next();
                }).catch(next);
            }
        });
        //rota para retornar um dado específico através do id
        application.get('/autocomplete/:id', [this.validateId, (req, res, next) => {
                data_collect_model_1.DataCollect.findById(req.params.id).then(data => {
                    res.json(data);
                    return next();
                }).catch(next);
            }]);
        //rota para inserir um documento no mongodb
        application.post('/autocomplete', (req, res, next) => {
            let document = new data_collect_model_1.DataCollect(req.body);
            document.save().then(dataCollect => {
                res.json(dataCollect);
                return next();
            }).catch(next);
        });
        //rota para atualizar um documento através do seu id
        application.patch('/autocomplete/:id', [this.validateId, (req, res, next) => {
                const options = { runValidators: true, new: true };
                data_collect_model_1.DataCollect.findByIdAndUpdate(req.params.id, req.body, options).then(data => {
                    res.json({ "message": "Documento atualizado com sucesso!", "data": data });
                    return next();
                }).catch(next);
            }]);
        //rota para deletar um docuemnto através do seu id
        application.del('/autocomplete/:id', [this.validateId, (req, res, next) => {
                data_collect_model_1.DataCollect.deleteOne({ _id: req.params.id }).exec().then((cmdResult) => {
                    if (cmdResult.n) {
                        res.json({ "message": "Documento excluído com sucesso!" });
                    }
                    else {
                        res.send(404);
                    }
                    return next();
                }).catch(next);
            }]);
    }
}
exports.dataCollectRouter = new DataCollectRouter();
