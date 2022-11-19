/**
 * VersionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const controllerName = "VersionController";
const constants = require("../../constants/constants");
 
 module.exports = {
 
    /**
     * Get versions for Backend and microservices
     *
     * @name getVersion
     * @param {Object} req
     * @param {Object} res
     * @description
     *      This method is used to get Backend and microservices version
     */
    async getVersion(req, res) {
 
        try {

            var jsonVersions = {
                backend          : "1.0.0"
            };

            return HttpResponseService.json(200, res, constants.VERSION_SUCCESSFULLY_FETCHED, jsonVersions);
 
        } catch (err) {
            return HttpResponseService.internalServerError(req, res, err);
        }
    }
 
}
 
 