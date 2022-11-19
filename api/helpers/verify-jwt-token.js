const jwt = require('jsonwebtoken');
const constants = require("../constants/constants");
module.exports = {


  friendlyName: 'Verify jwt token',


  description: '',


  inputs: {
    token: {
      type: 'string',
      required: true,
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {
    try {
        var decoded = jwt.verify(inputs.token, sails.config.jwt.secretKey);
        if (decoded) {
            return {
                status: constants.VALID_TOKEN,
                data  : decoded
            };
        }
    } catch(err) {
        return {
            status: constants.INVALID_TOKEN,
            error : err
        };
    }

  }


};

