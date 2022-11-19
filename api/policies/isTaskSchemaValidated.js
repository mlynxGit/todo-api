/**
 * Policy isTaskSchemaValidated()
 *
 * Check if task schema is validated by analysing incoming data contained in Body
 */

const Joi = require("joi");

module.exports = function(req, res, next) {

    // Fetch body data
    let params = req.body;

    // Define validation schema
    const schema = Joi.object().keys({
        title: Joi.string().required().min(8).max(30),
        description : Joi.string().required().max(150)
    }).unknown(true);
    // unknown = true validate the schema if a unknown key has been provided additionnaly

    // Validate the request body data with the schema
    const { error } = schema.validate(params);
    if (error) {
        sails.log.info("Policies::isTaskSchemaValidated() - policy not validated. Bad request");
        return HttpResponseService.badRequest(res, error);
    } else {
        return next();
    }

};
 