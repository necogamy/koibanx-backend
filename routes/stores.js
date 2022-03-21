const express = require('express');
const router = express.Router();
const storesController = require('../controllers/stores.controller');

router.get('/stores', storesController.getStores);

router.post('/stores', storesController.newStore);

router.delete('/stores', storesController.deleteAllStores);
router.delete('/stores/:id', storesController.deleteStore);

router.put('/stores/:id', storesController.updateStore);

module.exports = router;
