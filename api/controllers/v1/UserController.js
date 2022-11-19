/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const controllerName = "UserController";
const constants = require("../../constants/constants");

module.exports = {
  
    async register(req, res) {
        try {

            sails.log.info(controllerName + "::" + req.options.action + "() - called");

            // Fetch body data
            const params = req.allParams();
            
            // Check if a user already exist with the same email
            let response = await UserService.getUserByEmail(params.email);
            console.log(response);
            
            sails.log.info(controllerName + "::" + req.options.action + "() - getUserByEmail " + response.status);

            switch (response.status) {

                case constants.RESOURCE_SUCCESSFULLY_FETCHED:

                    sails.log.info(controllerName + "::" + req.options.action + "() - A user already exist with the same email address.");
                    return HttpResponseService.conflictError(res, "User", "email", "user_already_exists");

                case constants.RESOURCE_NOT_FOUND:

                    let responseUserService = await UserService.createUser(params);
                    sails.log.info(controllerName + "::" + req.options.action + "() - responseUserService ", responseUserService);
                    
                    switch (responseUserService.status) {

                        case constants.RESOURCE_SUCCESSFULLY_CREATED :

                            const confirmLink = `${sails.config.custom.baseUrl}/user/confirm?token=${responseUserService.data.emailProofToken}`;
                            const email = {
                                to: params.email,
                                subject: 'Confirm Your account',
                                template: 'confirm',
                                context: {
                                    name: params.fullname,
                                    confirmLink: confirmLink,
                                },
                                };
                            await sails.helpers.sendMail(email);

                            sails.log.info(controllerName + "::" + req.options.action + "() - New user has been created : " +JSON.stringify(responseUserService) );
                            return HttpResponseService.json(201, res, constants.USER_SUCCESSFULLY_SIGNUP, responseUserService.data);

                        case constants.ERROR_CODE_FIELD_UNIQUE:
                            return HttpResponseService.conflictError(res, "User", "email", "user_already_exists");

                        default:
                            return HttpResponseService.internalServerError(req, res, responseUserService);

                    }

                default:
                    return HttpResponseService.internalServerError(req, res, response);
            }

        } catch(err) {
            return HttpResponseService.internalServerError(req, res, err);
        }
    },

    async confirm(req, res) {

        sails.log.info(controllerName + "::" + req.options.action + "() - called");

        // Fetch all request params
        const params = req.allParams();

        let responseUserService = await UserService.confirm(params.token);
        sails.log.info(controllerName + "::" + req.options.action + "() - responseUserService ", responseUserService);
        
        switch (responseUserService.status) {

            case constants.RESOURCE_SUCCESSFULLY_UPDATED:

                return HttpResponseService.json(200, res, constants.USER_SUCCESSFULLY_CONFIRMED, responseUserService.data);
            case constants.RESOURCE_NOT_FOUND:

                return HttpResponseService.badRequest(res, {details: [{message: "The provided token is expired, invalid, or already used up."}]});
            default:
                return HttpResponseService.internalServerError(req, res, responseUserService);
        }

    },

    async login(req, res) {
        try {

            sails.log.info(controllerName + "::" + req.options.action + "() - called");

            // Fetch body data
            const params = req.body;

            // Get user information
            let userData = await UserService.getUserByEmail(params.email);

            switch (userData.status) {

                case constants.RESOURCE_NOT_FOUND :
                    sails.log.info(controllerName + "::" + req.options.action + "() - Invalid credentials");
                    return HttpResponseService.unauthorized(res, "invalid_credentials");

                case constants.RESOURCE_SUCCESSFULLY_FETCHED :
                    sails.log.info(controllerName + "::" + req.options.action + "() - User has been retrieved");
                    break;

                default:
                    sails.log.info(controllerName + "::" + req.options.action + "() - An internal error has occured");
                    return HttpResponseService.internalServerError(req, res, response);
            }

            // Check if email address of the user account has been verified.
            if (!userData.data.isConfirmed) {
                sails.log.info(controllerName + "::" + req.options.action + "() - User account has not been verified after its creation, authentication rejected.");
                return HttpResponseService.forbidden(res, "unverified_email");
            }

            // Check user password accuracy
            let user =  {...userData.data};
            await sails.helpers.passwords.checkPassword(params.password, user.password)
            .intercept('incorrect', (error) => {
                return HttpResponseService.unauthorized(res, "invalid_credentials");
            });
            
            const token = await sails.helpers.generateJwtToken(user.id);
            // Get expires_in of current environement from config file
            const expiresIn = sails.config.jwt.expires_in;
            // Return access_token, token_type and expires_in values
            return HttpResponseService.jsonAuth(res, token, expiresIn, {userId: user.id});

        } catch(err) {
            return HttpResponseService.internalServerError(req, res, err);
        }
    }
};

