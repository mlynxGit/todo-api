/**
 * @name isJsonContentType
 * @description
 *      Responsible to check that the request header is correct on POST and PUT requests.
 */

module.exports = function(req, res, next) {
    var contentType = req.headers["content-type"];
    if (contentType && contentType.includes("application/json")) {
        return next();
    } else {
        sails.log.info("Policies::isJsonContentType() - policy not validate. Unauthorized access");
        return HttpResponseService.notAcceptable(res, "invalid_header");
    }
};