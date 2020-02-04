import * as mongoose from 'mongoose'

//model dos dados coletados pela API de manipulação de dados
export interface ProductItem extends mongoose.Document{
    name: string,
    price: number
}

export interface Sale extends mongoose.Document{
    timestamp: Date,
    revenue: number,
    transaction_id: number, 
    store_name: string, 
    products: ProductItem[] 
}

const productSchema = new mongoose.Schema({
    name: {
        type: String
    },
    price: {
        type: Number
    }
})

const saleSchema = new mongoose.Schema({
    timestamp: {
        type: Date
    },
    revenue:{
        type: Number
    },
    transaction_id: {
        type: String
    }, 
    store_name: {
        type: String
    },
    products: {
        type: [productSchema],
        default: []
    }
})

export const Sale = mongoose.model<Sale>('Sale', saleSchema)