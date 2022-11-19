/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

// Current API Version
const apiVersion = "v1";
// Current Prefix for all APIs of "api" group
const prefix = "/api/" + apiVersion;

let routes = {

    [`GET ${prefix}/`]: {
        controller: apiVersion + "/VersionController",
        action: "getVersion"
    },

    [`POST ${prefix}/user/register`]: {
        controller: apiVersion + "/UserController",
        action: "register"
    },

    [`GET ${prefix}/user/confirm`]: {
        controller: apiVersion + "/UserController",
        action: "confirm"
    },

    [`POST ${prefix}/user/login`]: {
        controller: apiVersion + "/UserController",
        action: "login"
    },

    [`GET ${prefix}/tasks`]: {
        controller: apiVersion + "/TaskController",
        action: "getAllTasks"
    },

    [`POST ${prefix}/tasks`]: {
        controller: apiVersion + "/TaskController",
        action: "createTask"
    },

    [`PUT ${prefix}/tasks/:id/complete`]: {
        controller: apiVersion + "/TaskController",
        action: "markTaskCompleted"
    },

    [`PUT ${prefix}/tasks/:id/revert`]: {
        controller: apiVersion + "/TaskController",
        action: "markTaskUncompleted"
    },

    [`DELETE ${prefix}/tasks/:id`]: {
        controller: apiVersion + "/TaskController",
        action: "deleteTaskById"
    }
}

module.exports.routes = routes;
