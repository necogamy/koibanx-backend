const mongoose = require('mongoose');
const logger = require('./utils/logger');
mongoose.Promise = Promise;

const express = require('express')
const app = express()
const dotenv = require('dotenv');
dotenv.config();
const config = require('config');

/* Choose connection, it's active the mongo atlas db, and remember .env config */
mongoose.connect(`mongodb+srv://${config.get('mongodb.username')}:${config.get('mongodb.password')}@${config.get('mongodb.clusterUrl')}/${config.get('mongodb.dbname')}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.connect('mongodb://' + config.get('mongodb.address') + '/' + config.get('mongodb.dbname'), { useNewUrlParser: true, useUnifiedTopology: true });

require('./utils/initializer').init()

const errorHandler = require('./middlewares/errorHandler');
const basicAuth = require('./middlewares/basicAuth');

// Before middleware's
app.use(express.json());
app.use(basicAuth);

// Routes
app.use('/api', require('./routes/stores'));

// After middleware's
app.use(errorHandler);

// Start the server
app.listen(config.get('port'));
logger.info('API initialized on port ' + config.get('port'));

module.exports = app
