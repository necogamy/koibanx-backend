const auth = require('basic-auth');
const UserModel = require('../models/user');
const bcrypt = require('bcrypt-nodejs');

const basicAuth = async (req, res, next) => {
    const koibanxTestUser = 'test@koibanx.com';
    console.log('Middleware: Basic Auth');
    let err;

    try {
        const user = await auth(req);
        if (!user) {
            err = new Error('Access Denied');
            err.name = 'AuthorizationError';
            throw err;
        }
    
        const storedUser = await UserModel.findOne({ username: koibanxTestUser })
    
        // Checking password and username
        bcrypt.compare(user.pass, storedUser.password, (err, response) => {
            if (!response || err) {
                err = new Error('Access Denied');
                err.name = 'AuthorizationError';
                throw err;
            }
        });

        if (storedUser.username !== user.name) {
            err = new Error('Access Denied');
            err.name = 'AuthorizationError';
            throw err;
        }
    
        // If basic auth ok:
        console.log('Basic Auth: success');
        next();
    } catch (err) {
        // If there's an authorization error, then will enter here
        console.log('Basic Auth: failure');
        next(err);
    }
}

module.exports = basicAuth;