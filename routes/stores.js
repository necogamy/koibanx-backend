const express = require('express');
const router = express.Router();
const storesController = require('../controllers/stores.controller');

router.get('/stores', storesController.getStores);

router.post('/stores', storesController.newStore);

module.exports = router;
