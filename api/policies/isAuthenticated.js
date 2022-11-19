/**
 * Policy isAuthenticated()
 *
 * Check if user is authenticated before accessing the resource.
 * This policy checks if:
 *  - JWT token is provided in the cookie header request
 *  - If token (JWT) is valid (not expired)
 */

const constants = require("../constants/constants");

module.exports = async function(req, res, next) {

    sails.log.info("Policies::isAuthenticated() - called.");
    var bearerToken;
    var bearerHeader = req.headers["authorization"];

    // Check first if there is a jwt token in cookie header in the request
    if (typeof req.cookies.jwt !== "undefined") {
        //sails.log.info("Policies::isAuthenticated() - req.cookies.jwt " + req.cookies.jwt);
        bearerToken = req.cookies.jwt;
    }

    // Check if there is any token inside Authoriation header. (Normally used by external applications)
    else if (typeof bearerHeader !== "undefined") {

        var bearer  = bearerHeader.split(" ");
        bearerToken = bearer[1];

        // Check if Bearer keyword is provided in authorization header. It should be: "Bearer <TOKEN>""
        if (bearer[0] !== "Bearer") {
            sails.log.info("Policies::isAuthenticated() - The format of authorization header is invalid.");
            return HttpResponseService.unauthorized(res, "invalid_token");
        }

    }
    console.log(bearerToken);
    if (bearerToken) {

        const responseFromJwtService = await sails.helpers.verifyJwtToken(bearerToken);

        switch (responseFromJwtService.status) {

            case constants.INVALID_TOKEN :

                sails.log.info("Policies::isAuthenticated() - Provided jwt token is invalid. Error = " + responseFromJwtService.error);
                return HttpResponseService.unauthorized(res, "invalid_token");

            case constants.VALID_TOKEN :

                // Reset global variable for userId used by logs
                sails.config.globals.userId = responseFromJwtService.data.userId;

                sails.log.info("Policies::isAuthenticated() - Provided jwt token is valid");

                User.findOne(responseFromJwtService.data.userId).exec(function callback(error, user) {
                    if (error) {
                        return HttpResponseService.internalServerError(req, res, error);
                    }
                    if (!user) {
                        // User is not found, but we want to display an explicit message to the user: authentication failed instead of resource not found
                        return HttpResponseService.unauthorized(res, "invalid_token", {userId: responseFromJwtService.data.userId});
                    }
                    // User has been found, add it to the req to be used later easily on controllers
                    req.user = user;
                    // Continue execution now..
                    return next();
                });
                
            default:
                break;
        }

    } else {
        sails.log.info("Policies::isAuthenticated() - The token has not been found in the cookie header request.");
        return HttpResponseService.unauthorized(res, "invalid_token");
    }
 
};
 