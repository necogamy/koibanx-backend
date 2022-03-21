const StoreModel = require('../models/store');

const controller = {}

controller.getStores = async (req, res) => {
    try {
        const { q } = req.query;
        let allStores;

        const payload = {
            data: [],
            page: 0,
            pages: 0,
            limit: 0,
            total: 0
        }
        
        if (q) {
            const queries = JSON.parse(q);
            const limit = queries.limit ? queries.limit : 0;
            const nPerPage = 100;
            const page = queries.page && queries.page > 0 ? queries.page : 0;
            const pagination = page > 0 ? page * nPerPage : 0;

            allStores = await StoreModel
                .find()
                .limit(limit)
                .skip(pagination);

            payload.limit = limit;
            payload.page = page;
            payload.pages = pagination;
        } else {
            allStores = await StoreModel.find();
        }

        allStores = allStores.map(store => {
            // Formatting response
            const currency = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })
                .format(store.currentBalance);

            const storePayload = {
                'ID': store.id,
                'Comercio': store.name,
                'CUIT': store.cuit,
                'Conceptos': [],
                'Balance actual': currency,
                'Activo': store.active ? 'Sí' : 'No',
                'Última venta': String(store.lastSale)
            }

            for (const i in store) {
                if (/concept/.test(i)) storePayload['Conceptos'].push(store[i]);
            }

            storePayload['Conceptos'] = storePayload['Conceptos'].filter(concepto => concepto);

            return storePayload;
        });

        // Send payload
        payload.data = allStores;
        payload.total = allStores.length;
        res.status(200).json(payload);
    } catch (err) {
        console.error(err);
    }
}

controller.newStore = async (req, res, next) => {
    try {
        const { name, cuit, conceptOne, currentBalance, active, lastSale } = req.body;
        let err;
        
        if (![ name, cuit, conceptOne, currentBalance, lastSale ].every(Boolean)) {
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

        const payload = {
            message: 'Store created successfully',
            data: store
        }
        res.status(201).json(payload);
    } catch (err) {
        next(err);
    }
}

controller.deleteAllStores = async (req, res, next) => {
    try {
        const deleteAll = await StoreModel.deleteMany({});
        res.status(200).send('Deleted all stores successfully');
    } catch (err) {
        next(err);
    }
}

controller.deleteStore = async (req, res, next) => {
    try {
        const { id } = req.params;

        // If there's an error then it automatically throws the error
        const deleteStore = await StoreModel.deleteOne({ _id: id });
        res.status(200).send('Deleted the store successfully');
    } catch (err) {
        if (err.name === 'CastError') {
            err = new Error('Store doesn\'t exists');
            err.name = 'NotFoundError';
        }
        next(err);
    }
}

controller.updateStore = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, cuit, conceptOne, currentBalance, active, lastSale } = req.body;

        if (![ name, cuit, conceptOne, currentBalance, lastSale ].every(Boolean)) {
            err = new Error('All fields must be filled');
            err.name = 'BadRequest';
            throw err;
        }

        // If there's an error then it automatically throws the error
        const findStore = await StoreModel.findOne({ _id: id });

        const toUpdate = {
            name,
            cuit,
            conceptOne,
            currentBalance,
            active,
            lastSale
        }
        if (req.body.conceptTwo) toUpdate.conceptTwo = req.body.conceptTwo;
        if (req.body.conceptThree) toUpdate.conceptThree = req.body.conceptThree;
        if (req.body.conceptFour) toUpdate.conceptFour = req.body.conceptFour;
        if (req.body.conceptFive) toUpdate.conceptFive = req.body.conceptFive;
        if (req.body.conceptSix) toUpdate.conceptSix = req.body.conceptSix;

        const updateStore = await StoreModel.updateOne({ _id: id }, toUpdate);
        res.status(200).send('Update the store successfully');
    } catch (err) {
        if (err.name === 'CastError') {
            err = new Error('Store doesn\'t exists');
            err.name = 'NotFoundError';
        }
        next(err);
    }
}

module.exports = controller