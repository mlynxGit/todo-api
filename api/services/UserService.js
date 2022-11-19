/**
 * UserService
 * @description :: Server-side service for managing database requests.
 */

const constants = require("../constants/constants");
const serviceName = "UserService";

module.exports = {

    /**
     * Create a new user
     *
     * @name createUser
     * @param {Object} params
     * @param {String} activationId
     * @description
     *      This method is used to create a new user account
     */
    async createUser(params) {

        try {

            const token = await sails.helpers.strings.random('url-friendly');

            let attributes = {};
            if (params.hasOwnProperty("fullname")) {
                attributes.fullName = params.fullname;
            }
            if (params.hasOwnProperty("email")) {
                attributes.email = params.email.toLowerCase();
            }
            if (params.hasOwnProperty("password")) {
                attributes.password = params.password
            }

            attributes.emailProofToken = token;
            attributes.emailProofTokenExpiresAt = Date.now() + sails.config.custom.emailProofTokenTTL;

            const createdUser = await User.create(attributes).fetch();

            return {
                status: constants.RESOURCE_SUCCESSFULLY_CREATED,
                data: createdUser
            };

        } catch (err) {
            sails.log.info("UserService.createUser() error ");

            if (err.raw && err.raw.code === constants.ERROR_CODE_FIELD_UNIQUE) {

                return {
                    status: constants.ERROR_CODE_FIELD_UNIQUE,
                    ...err.raw
                };

            } else {

                return {
                    status: constants.DATABASE_ERROR,
                    name: err.name ? err.name : "",
                    message: err.message ? err.message : "",
                    stack: err.stack ? err.stack : "",
                    code: err.code ? err.code : ""
                };
            }
        }

    },

    /**
     * Get a user by its email
     *
     * @name getUserByEmail
     * @param {string} email
     * @description
     *      This method is used to get user object by its email.
     */
    async getUserByEmail(email) {

        try {

            const user = await User.findOne({
                email: email.toLowerCase()
            })

            if (!user) {
                return {
                    status: constants.RESOURCE_NOT_FOUND
                };
            } else {
                return {
                    status: constants.RESOURCE_SUCCESSFULLY_FETCHED,
                    data: user
                };
            }

        } catch (err) {
            return {
                status: constants.DATABASE_ERROR,
                name: err.name ? err.name : "",
                message: err.message ? err.message : "",
                stack: err.stack ? err.stack : "",
                code: err.code ? err.code : ""
            };
        }
    },

    /**
     * confirm user
     *
     * @name confirm
     * @param {string} token
     * @description
     *      This method is used to confirm a user.
     */
    async confirm(token) {
        var user = await User.findOne({ emailProofToken: token });

        if (!user || user.emailProofTokenExpiresAt <= Date.now()) {

            return {
                status: constants.RESOURCE_NOT_FOUND
            };

        } else {

            if (!user.isConfirmed) {

                await User.updateOne({ id: user.id }).set({
                  isConfirmed: true,
                  emailProofToken: '',
                  emailProofTokenExpiresAt: 0,
                });
            }
            return {
                status: constants.RESOURCE_SUCCESSFULLY_UPDATED,
                data: user
            };
        }
    }

    
}