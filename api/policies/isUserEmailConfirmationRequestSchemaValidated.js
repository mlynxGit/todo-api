/**
 * Policy isUserEmailConfirmationRequestSchemaValidated()
 *
 * Check if request to confirm user registration schema is validated by analysing incoming data contained in url
 */

const Joi = require("joi");

module.exports = function(req, res, next) {

    // Fetch body data
    let params = req.query;

    // Define validation schema
    const schema = Joi.object().keys({
        token: Joi.string().required().min(10).max(30)
    }).unknown(true);
    // unknown = true validate the schema if a unknown key has been provided additionnaly

    // Validate the request body data with the schema
    const { error } = schema.validate(params);
    if (error) {
        sails.log.info("Policies::isUserEmailConfirmationRequestSchemaValidated() - policy not validated. Bad request");
        return HttpResponseService.badRequest(res, error);
    } else {
        return next();
    }

};
 