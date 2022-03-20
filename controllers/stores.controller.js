const StoreModel = require('../models/store');

const controller = {}

controller.getStores = async (req, res) => {
    try {
        const allStores = await StoreModel.find();
        res.status(200).send(allStores);
    } catch (err) {
        console.error(err);
    }
}

controller.newStore = async (req, res) => {
    try {
        const store = new StoreModel();
        store.name
    } catch (err) {
        console.error(err);
    }
}

module.exports = controller