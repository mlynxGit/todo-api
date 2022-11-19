/**
 * TaskController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const constants = require("../../constants/constants");
const controllerName = "TaskController";

module.exports = {
    /**
     * Create one Task
     *
     * @name createTask
     * @param {Object} req
     * @param {Object} res
     * @description
     *      This method is used to create a Task.
     */
    async createTask(req, res) {

        try {

            // Fetch body data
            let params = req.allParams();
            params.userId = req.user.id;
            sails.log.info(controllerName + "::" + req.options.action + "() userId=(" + req.user.id + ") - tasks parameters = " + JSON.stringify(params));

            // Create the task
            let response = await TaskService.createTask(params);
            switch (response.status) {

                case constants.RESOURCE_SUCCESSFULLY_CREATED:

                    sails.log.info(controllerName + "::" + req.options.action + "() userId=(" + req.user.id + ") - Task has been created. Task id = " + response.data.id);
                    // Send response
                    return HttpResponseService.json(201, res, constants.TASK_SUCCESSFULLY_CREATED, response.data);

                default:
                    return HttpResponseService.internalServerError(req, res, response);

            }

        } catch (err) {
            return HttpResponseService.internalServerError(req, res, err);
        }

    },

    /**
     * Get all Tasks of the current user
     *
     * @name getAllTasks
     * @param {Object} req
     * @param {Object} res
     * @description
     *      This method is used to get all tasks of the logged in user
     */
    async getAllTasks(req, res) {

        try {

            sails.log.info(controllerName + "::" + req.options.action + "() - called");

            const userId = req.user.id;

            let response = await TaskService.getAllTasks(userId);

            switch (response.status) {

                case constants.RESOURCES_SUCCESSFULLY_FETCHED:
                    // Send response
                    return HttpResponseService.json(200, res, constants.TASKS_SUCCESSFULLY_FETCHED, response.data);

                default:
                    return HttpResponseService.internalServerError(req, res, response);

            }

        } catch (err) {
            return HttpResponseService.internalServerError(req, res, err);
        }

    },

    /**
     * mark Task Completed
     *
     * @name markTaskCompleted
     * @param {Object} req
     * @param {Object} res
     * @description
     *      This method is used to mark a Task as Completed given its id.
     */
    async markTaskCompleted(req, res) {

        try {

            sails.log.info(controllerName + "::" + req.options.action + "() - called");

            const taskId = req.params.taskId;
            const userId = req.user.id;

            let response = await TaskService.markTaskCompleted(taskId, userId);

            switch (response.status) {

                case constants.RESOURCE_SUCCESSFULLY_FETCHED:
                    // Send response
                    return HttpResponseService.json(200, res, constants.TASK_SUCCESSFULLY_UPDATED, response.data);

                case constants.RESOURCE_NOT_FOUND:
                    return HttpResponseService.notFound(res, "Task", "taskId", taskId);

                default:
                    return HttpResponseService.internalServerError(req, res, response);

            }

        } catch (err) {
            return HttpResponseService.internalServerError(req, res, err);
        }

    },

    /**
     * mark a single task as uncompleted given its id
     *
     * @name markTaskUncompleted
     * @param {Object} req
     * @param {Object} res
     * @description
     *      This controller permits to mark a task as uncompleted given its id.
     */
    async markTaskUncompleted(req, res) {

        try {

            sails.log.info(controllerName + "::" + req.options.action + "() - called");

            const taskId = req.params.taskId;
            const userId = req.user.id;

            let response = await TaskService.markTaskUncompleted(taskId, userId);

            switch (responseUpdate.status) {

                case constants.RESOURCE_SUCCESSFULLY_UPDATED:
                    // Send response
                    return HttpResponseService.json(200, res, constants.TASK_SUCCESSFULLY_UPDATED, responseUpdate.data, response.data);

                default:
                    return HttpResponseService.internalServerError(req, res, responseUpdate);

            }

        } catch (err) {
            return HttpResponseService.internalServerError(req, res, err);
        }

    },

    /**
     * Delete one task identified by its id
     *
     * @name deleteTaskById
     * @param {Object} req
     * @param {Object} res
     * @description
     *      This controller permits to delete a task given its id.
     */
    async deleteTaskById(req, res) {

        try {

            sails.log.info(controllerName + "::" + req.options.action + "() - called");

            const taskId = req.params.taskId;
            const userId = req.user.id;

            let responseDelete = await TaskService.deleteTaskById(taskId, userId);

            switch (responseDelete.status) {

                case constants.RESOURCE_SUCCESSFULLY_DELETED:

                    // Send response
                    return HttpResponseService.json(200, res, constants.TASK_SUCCESSFULLY_DELETED, responseDelete.data);

                default:
                    return HttpResponseService.internalServerError(req, res, responseDelete);
            }

        } catch (err) {
            return HttpResponseService.internalServerError(req, res, err);
        }

    }

};

