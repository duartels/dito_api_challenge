# Desafio Dito -> Back-end
#### by Luan de Souza Duarte
Desafio em feito em cima de duas propostas passadas: um serviço de Autocomplete e um problema de manipulação de dados.

## Propósito da aplicação 

#### 1 - Serviço de Autocomplete 
O serviço deve conter uma **API Coletora** de dados e o mecanismo de **Autocomplete** propriamente dito. 
**API Coletora**
Você deverá construir uma API para coletar e armazenar os dados. Esta API deverá receber informações de navegação dos usuários em um site. Um exemplo seria: 
```
    {
        "event": "buy", 
        "timestamp": "2016-09-22T13:57:31.2311892-04:00"
    }
```
O mecanismo de autocomplete deve ser implementado e disponibilizado através de uma API, contendo um campo de busca que deverá completar o nome dos eventos a partir da segunda letra que o usuário digitar. 

### 2 - Manipulação de Dados 
O objetivo é criar uma timeline de compras a partir dos eventos disponíveis neste endpoint: [https://storage.googleapis.com/dito-questions/events.json](https://storage.googleapis.com/dito-questions/events.json.)
Um evento representa um comportamento de uma pessoa, seja no mundo online ou offline. Quando uma pessoa faz uma compra, um evento **comprou** é gerado contendo o total de receita gerada e o nome da loja.
Para cada produto dessa compra é gerado um evento **comprou-produto**, contendo o nome e preço do produto. 
Você deve implementar uma função, em qualquer linguagem de programação, que consuma esse endpoint e agrupe as compras pelo campo **transaction_id**. Cada item da timeline deve representar uma compra em uma determinada loja e deve conter uma **lista** com os produtos comprados. 
A timeline deve ser **ordenada** pelo campo **timestamp** na ordem decrescente. 
A resposta esperada dessa função é a seguinte:
```
{ 
"timeline": [ { 
                "timestamp": "2016-10-02T11:37:31.2300892-03:00", 
                "revenue": 120.0, 
                "transaction_id": "3409340", 
                "store_name": "BH Shopping", 
                "products": [ { 
                                "name": "Tenis Preto", 
                                "price": 120 
                              } 
                            ] 
              }, 
              { 
                "timestamp": "2016-09-22T13:57:31.2311892-03:00", 
                "revenue": 250.0, 
                "transaction_id": "3029384", 
                "store_name": "Patio Savassi", 
                "products": [ { 
                                "name": "Camisa Azul", 
                                "price": 100 
                              }, 
                              { 
                                "name": "Calça Rosa", 
                                "price": 150
                              } 
                            ] 
              } 
            ] 
} 
```
## Ambiente
```
Node -> Versão 10.0.0 ou  acima
```

### Instalando e configurando o projeto
Após realizar a clonagem do projeto para a sua máquina, entre no terminal(CMD), vá até a pasta onde o mesmo foi clonado e digite o seguinte comando para instalar todas as dependências da aplicação.

```
npm install
```

### Iniciando o projeto
O banco de dados NOSql MongoDB deve estar instalado para o funcionamento da aplicação, caso não o tenha instalo, seguir as instruções de download no seguinte link:

[MongoDB install guide](https://docs.mongodb.com/guides/server/install/)

Caso não tenha o nodemon instalado, será necessário realizar a instalação do mesmo, que pode ser feita com o seguinte comando:

```
npm install -g nodemon
```

Assim que todas as instalações forem concluídas com êxito, digite o seguinte comando no terminal(CMD) para dar ínicio a aplicação.

```
npm start
```

Por padrão a aplicação será iniciada no seguinte endereço: 

[http://localhost:1000](http://localhost:1000)


## Rotas
Dentro da API, são disponibilizadas **7 rotas diferentes** para o cliente acessar e receber os dados requisitados, que são as seguintes rotas:
### Rotas de Manipulação de Dados
--
#### Para importar os documentos para o MongoDB

##### -> Exemplo: ```GET -> http://localhost:1000/sales/import```

Rota responsável para realizar a importação dos documentos adquiridos através do link passado pelo enunciado.
    
#### Para acessar todos as vendas presentes no banco de dados em timeline ordenado de forma decrescente pelo campo de data
##### -> Exemplo:  ```GET -> http://localhost:1000/sales/timeline```

O retorno recebido pela requisição, irá conter todos os jogos que foram encontrados no arquivo de log, com os seus respectivos dados, como no exemplo a seguir:

```
{
    "timeline":[{
                "_id": "5e31c9dd8e3d4ec830fd71b4",
                "timestamp": "2016-10-02T14:37:31.230Z",
                "revenue": 120,
                "transaction_id": "3409340",
                "store_name": "BH Shopping",
                "products":[{
                            "name": "Tenis Preto",
                            "price": 120
                            }]
                },
                {
                "_id": "5e31c9dd8e3d4ec830fd71b3",
                "timestamp": "2016-09-22T16:57:31.231Z",
                "revenue": 250,
                "transaction_id": "3029384",
                "store_name": "Patio Savassi",
                "products":[{
                            "name": "Camisa Azul",
                            "price": 100
                            },
                            {
                            "name": "Calça Rosa",
                            "price": 150
                            }]
                }]
}
```
### Rotas Autocomplete
--
#### Para inserir um documento no MongoDB
##### Exemplo -> ```POST -> http://localhost:1000/autocomplete```

Será passado junto a requisição um body para a inserção do documento no MongoDB. Como no exemplo a seguir:
```
{
    "event":"buy"
}
```

#### Para buscar os documentos no MongoDB
##### Exemplo -> ```GET -> http://localhost:1000/autocomplete```

A requisição retorna os documentos encontrados no MongoDB, onde pode ser realizado o processo de autocomplete também, ao passar um termo para busca na URL. Como no exemplo a seguir:
```
http://localhost:1000/autocomplete?event=bu
```

Exemplo do retorno obtido:
```
[{
    "_id": "5e385dd1e9341e181c2a6235",
    "event": "buy",
    "timestamp": "2020-02-03T17:52:17.780Z",
    "__v": 0
}]
```

#### Para buscar um documento específico no MongoDB
##### Exemplo -> ```GET -> http://localhost:1000/autocomplete/5e385de4e9341e181c2a6239```

A requisição retorna um documento específico se encontrado através do seu id. Exemplo de retorno:
```
{
    "_id": "5e385de4e9341e181c2a6239",
    "event": "resale",
    "timestamp": "2020-02-03T17:52:36.340Z",
    "__v": 0
}
```

#### Para atualizar um documento específico no MongoDB
##### Exemplo -> ```PATCH -> http://localhost:1000/autocomplete/5e385de4e9341e181c2a6239```

A requisição atualiza um documento específico se encontrado através do seu id, deve ser passado um body junto a ela para que algum campo sofra alteração. Como no exemplo a seguir:
```
{
    "event":"sale"
}
```

Exemplo de retorno:
```
{
    "message": "Documento atualizado com sucesso!",
    "data":{
            "_id": "5e385de4e9341e181c2a6239",
            "event": "sale",
            "timestamp": "2020-02-03T17:52:36.340Z",
            "__v": 0
            }
}
```

#### Para deletar um documento específico no MongoDB
##### Exemplo -> ```DEL -> http://localhost:1000/autocomplete/5e385de4e9341e181c2a6239```

A requisição deleta um documento específico se encontrado através do seu id.
Exemplo de retorno:
```
{
    "message": "Documento excluído com sucesso!"
}
```

## Tecnologias utilizadas no desenvolvimento
- [NodeJS](https://nodejs.org/en/) -> Ambiente Javascript server-side.
- [Restify](http://restify.com/) -> Framework web service para NodeJS
- [Typescript](https://www.typescriptlang.org/) -> Compila Javascript, usado para detecção de erros em dev time.


