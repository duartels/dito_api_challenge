import * as mongoose from 'mongoose'

//model dos dados coletados pela API coletora
export interface DataCollectItem extends mongoose.Document{
    event: string,
    timestamp: Date
}

const dataCollectSchema = new mongoose.Schema({
    event: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
})

export const DataCollect = mongoose.model<DataCollectItem>('DataCollect', dataCollectSchema);

