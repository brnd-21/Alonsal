const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    uid: { type: String, default: null },
    type: { type: Number, default: null },
    data: { type: Number, default: null },
    stats: {
        price: { type: Number, default: 20 },
        days: { type: Number, default: null },
        hour: { type: String, default: null },
        active: { type: Boolean, default: false },
        timestamp: { type: Number, default: null }
    }
})

const model = mongoose.model("Module", schema)

async function getActiveModules() {
    return model.find({ "stats.active": true })
}

async function createModule(uid, type, timestamp) {
    await model.create({ uid: uid, type: type, "stats.timestamp": timestamp })

    return model.findOne({ uid: uid, "stats.timestamp": timestamp })
}

async function getModule(uid, timestamp) {
    return model.findOne({ uid: uid, "stats.timestamp": timestamp })
}

async function dropModule(uid, type, timestamp) {
    await model.findOneAndDelete({ uid: uid, type: type, "stats.timestamp": timestamp })
}

async function dropAllUserModules(uid) {
    await model.findOneAndDelete({ uid: uid })
}

async function verifyUserModules(uid, type) {
    return model.find({ uid: uid, type: type })
}

// Lista todos os módulos de determinado usuário
async function listAllUserModules(uid) {
    return model.find({ uid: uid })
}

// Retorna um preço pelos módulos ativos de determinado usuário
async function getModulesPrice(uid) {
    let modulos = await model.find({ uid: uid, "stats.active": true })
    let total = 0

    modulos.forEach(element => {
        total += element.stats.price
    })

    return total
}

module.exports.Badge = model
module.exports = {
    createModule,
    getModule,
    dropModule,
    getModulesPrice,
    getActiveModules,
    listAllUserModules,
    dropAllUserModules,
    verifyUserModules
}