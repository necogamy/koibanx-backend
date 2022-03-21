const User = require('../models/user')
const logger = require('../utils/logger')

exports.init = async function () {
    let user = new User();

    if (await User.countDocuments({"username": "test@koibanx.com"})) {
        logger.info('Test user test@koibanx.com it\'s available');
    } else {
        user.username = 'test@koibanx.com';
        user.password = 'test123';
        await User.create(user);
        logger.info("test@koibanx.com/test123 User created")
    }
}
