const errorHandler = (err, req, res, next) => {
    // Response by errors
    switch (err.name) {
        case "NotFoundError":
            res.status(404);
            break;
        case "BadRequest":
            res.status(400);
            break;
        case "AuthorizationError":
            res.status(401);
            break;
        default:
            res.status(500);
            break;
    }
    return res.send({ errors: err.message });
};

module.exports = errorHandler;