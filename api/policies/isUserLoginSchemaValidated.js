/**
 * Policy isUserLoginSchemaValidated()
 *
 * Check if request to login user is validated by analysing incoming data contained in url
 */

const Joi = require("joi");
const constants = require("../constants/regex");

module.exports = function(req, res, next) {

    // Fetch body data
    let params = req.body;

    // Define validation schema
    const schema = Joi.object().keys({
        email : Joi.string().required().email({
            ignoreLength: true
        }).max(100),
        password: Joi.string().regex(constants.password).required()
    }).unknown(true);
    // unknown = true validate the schema if a unknown key has been provided additionnaly

    // Validate the request body data with the schema
    const { error } = schema.validate(params);
    if (error) {
        sails.log.info("Policies::isUserLoginSchemaValidated() - policy not validated. Bad request");
        return HttpResponseService.badRequest(res, error);
    } else {
        return next();
    }

};
 