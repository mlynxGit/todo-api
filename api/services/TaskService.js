/**
 * TaskService
 * @description :: Server-side service for managing database requests.
 */

const constants = require("../constants/constants");

module.exports = {

    /**
     * Create one Task
     *
     * @name createTask
     * @param {Object} params
     * @description
     *      This service permits to create a Task.
     */
    async createTask(params) {

        try {

            let attributes = {};
            if (params.hasOwnProperty("title")) {
                attributes.title = params.title;
            }
            if (params.hasOwnProperty("description")) {
                attributes.description = params.description;
            }
            if (params.hasOwnProperty("userId")) {
                attributes.user = params.userId;
            }

            let createdTask = await Task.create(attributes).fetch();

            return {
                status: constants.RESOURCE_SUCCESSFULLY_CREATED,
                data  : createdTask
            };

        } catch (err) {
            return {
                status : constants.DATABASE_ERROR,
                name   : err.name ? err.name      : "",
                message: err.message ? err.message: "",
                stack  : err.stack ? err.stack    : "",
                code   : err.code ? err.code      : ""
            };
        }

    },

    /**
     * Get all Tasks of the current user
     *
     * @name getAllTasks
     * @param {string} userId
     * @description
     *      This service permits to fetch all tasks of the logged in user
     */
    async getAllTasks(userId) {

        try {

            const tasks = await Task.find({
                user: userId
            }).sort('updatedAt DESC');

            return {
                status: constants.RESOURCES_SUCCESSFULLY_FETCHED,
                data  : tasks
            };

        } catch (err) {
            return {
                status : constants.DATABASE_ERROR,
                name   : err.name ? err.name      : "",
                message: err.message ? err.message: "",
                stack  : err.stack ? err.stack    : "",
                code   : err.code ? err.code      : ""
            };
        }

    },

    /**
     * mark Task Completed
     *
     * @name markTaskCompleted
     * @param {string} taskId
     * @param {string} userId
     * @description
     *      This service permits to mark a Task as Completed given its id.
     */
    async markTaskCompleted(taskId, userId) {

        try {

            const task = await Task.updateOne({
                id: taskId,
                user: userId
            }).set({isCompleted: false});

            return {
                status: constants.RESOURCE_SUCCESSFULLY_UPDATED,
                data  : task
            };

        } catch (err) {
            return {
                status : constants.DATABASE_ERROR,
                name   : err.name ? err.name      : "",
                message: err.message ? err.message: "",
                stack  : err.stack ? err.stack    : "",
                code   : err.code ? err.code      : ""
            };
        }

    },

    /**
     * mark a single task as uncompleted given its id
     *
     * @name markTaskUncompleted
     * @param {string} taskId
     * @param {string} userId
     * @description
     *      This service permits to mark a task as uncompleted given its id.
     */
    async markTaskUncompleted(taskId, userId) {

        try {

            const task = await Task.updateOne({
                id: taskId,
                user: userId
            }).set({isCompleted: true});

            return {
                status: constants.RESOURCE_SUCCESSFULLY_UPDATED,
                data  : task
            };

        } catch (err) {
            return {
                status : constants.DATABASE_ERROR,
                name   : err.name ? err.name      : "",
                message: err.message ? err.message: "",
                stack  : err.stack ? err.stack    : "",
                code   : err.code ? err.code      : ""
            };
        }

    },

    /**
     * Delete one task identified by its id
     *
     * @name deleteTaskById
     * @param {string} taskId
     * @description
     *      This service permits to delete a task given its id.
     */
    async deleteTaskById(taskId) {

        try {

            const task = await Task.destroy({
                id: taskId
            }).fetch();

            return {
                status: constants.RESOURCE_SUCCESSFULLY_DELETED,
                data  : task
            };

        } catch (err) {
            return {
                status : constants.DATABASE_ERROR,
                name   : err.name ? err.name      : "",
                message: err.message ? err.message: "",
                stack  : err.stack ? err.stack    : "",
                code   : err.code ? err.code      : ""
            };
        }

    }
};