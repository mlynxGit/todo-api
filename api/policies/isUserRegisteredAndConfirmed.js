/**
 * Policy isUserRegisteredAndConfirmed()
 *
 * Check if the user has already registered and confirmed their account
 */

const Joi = require("joi");
const constants = require("../constants/regex");

module.exports = async function(req, res, next) {

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
        sails.log.info("Policies::isUserRegisteredAndConfirmed() - policy not validated. Bad request");
        return HttpResponseService.badRequest(res, error);
    } else {
        try {
            const user = await User.findOne({ email: params.email });
            if (!user) {
                return HttpResponseService.notFound(res, "User", "email", params.email);
            } else if (!user.isConfirmed) {
                return HttpResponseService.unauthorized(res, "This account has not been confirmed. Click on the link in the email sent to you to confirm.");
            } else {
                return next();
            }
        } catch (error) {
            return HttpResponseService.unauthorized(res, error.message );
        }
    }

};
 