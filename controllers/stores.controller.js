const StoreModel = require('../models/store');

const controller = {}

controller.getStores = async (req, res) => {
    try {
        const { q } = req.query;
        let allStores;
        
        if (q) {
            const queries = JSON.parse(q);
            allStores = await StoreModel
                .find()
                .limit(queries.limit ? queries.limit : 0);
        } else {
            allStores = await StoreModel.find();
        }

        allStores = allStores.map(store => {
            // Formatting response
            const currency = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })
                .format(store.currentBalance);

            const payload = {
                'ID': store.id,
                'Comercio': store.name,
                'CUIT': store.cuit,
                'Conceptos': [],
                'Balance actual': currency,
                'Activo': store.active ? 'Sí' : 'No',
                'Última venta': String(store.lastSale)
            }

            for (const i in store) {
                if (/concept/.test(i)) payload['Conceptos'].push(store[i]);
            }

            payload['Conceptos'] = payload['Conceptos'].filter(concepto => concepto);

            return payload;
        });
        
        const payload = {
            data: allStores,
            page: 0,
            pages: 0,
            limit: 0,
            total: 0
        }
        res.status(200).json(payload);
    } catch (err) {
        console.error(err);
    }
}

controller.newStore = async (req, res, next) => {
    try {
        const { name, cuit, conceptOne, currentBalance, active, lastSale } = req.body;
        let err;
        
        if (![ name, cuit, conceptOne, currentBalance, active, lastSale ].every(Boolean)) {
            err = new Error('All fields must be filled');
            err.name = 'BadRequest';
            throw err;
        }

        const verify = typeof name !== 'string'
            || typeof cuit !== 'string'
            || typeof conceptOne !== 'string'
            || typeof currentBalance !== 'number'
            || typeof active !== 'boolean'
            || typeof lastSale !== 'string';
        if (verify) {
            err = new Error('Invalid data type');
            err.name = 'BadRequest';
            throw err;
        }

        let store = new StoreModel();
        store.name = name;
        store.cuit = cuit;
        store.conceptOne = conceptOne;
        store.currentBalance = currentBalance;
        store.active = active;
        store.lastSale = lastSale;

        if (req.body.conceptTwo) store.conceptTwo = req.body.conceptTwo;
        if (req.body.conceptThree) store.conceptThree = req.body.conceptThree;
        if (req.body.conceptFour) store.conceptFour = req.body.conceptFour;
        if (req.body.conceptFive) store.conceptFive = req.body.conceptFive;
        if (req.body.conceptSix) store.conceptSix = req.body.conceptSix;

        store = await store.save();

        if (!store) {
            err = new Error('Error at saving the store');
            throw err;
        }

        res.status(201).json(store);
    } catch (err) {
        next(err);
    }
}

module.exports = controller