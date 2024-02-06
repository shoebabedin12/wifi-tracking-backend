const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const clientSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    macAddress:{
        type: String,
        required: true,
    } ,
    device:{
        type: String,
        required: true,
    },
    roomNo:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        default: "pending",
        required: true,
    }
},{
    timestamps: true,
})


module.exports = mongoose.model("Client", clientSchema);