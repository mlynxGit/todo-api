const jwt = require('jsonwebtoken');

module.exports = {


  friendlyName: 'Generate jwt token',


  description: '',


  inputs: {
    userId: {
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
    const payload = {
      userId: inputs.userId,
      iss: 'FoodStyles API'
    };

    const secret = sails.config.jwt.secretKey || process.env.JWT_SECRET;

    const token = jwt.sign(payload, secret, { expiresIn: '1d' });

    return token;
  }

};

