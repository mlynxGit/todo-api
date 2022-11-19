/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/

  "v1/UserController": {
    register : ["isUserSchemaValidated", "isJsonContentType"],
    confirm: ["isUserEmailConfirmationRequestSchemaValidated"],
    login: ["isJsonContentType", "isUserRegisteredAndConfirmed", "isUserLoginSchemaValidated"]
  },
  "v1/TaskController": {
    getAllTasks : ["isAuthenticated"],
    createTask : ["isAuthenticated", "isJsonContentType", "isTaskSchemaValidated"],
    markTaskCompleted : ["isAuthenticated"],
    markTaskUncompleted : ["isAuthenticated"],
    deleteTaskById : ["isAuthenticated"]
  }
};
