//variável com algumas configurações padrão para ser utilizada durante o desenvolvimento
export const environment = {
    server: {
        port: process.env.SERVER_PORT || 1000
    },
    db: {
        url: process.env.DB_URL || 'mongodb://localhost/dito-api'
    }
}