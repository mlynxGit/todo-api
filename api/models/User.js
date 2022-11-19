/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    email: {
      type: 'string',
      required: true,
      unique: true,
    },
    password: {
      type: 'string',
      required: true
    },
    fullName: {
      type: 'string',
      required: true,
      columnName: 'full_name'
    },
    isConfirmed: {
      type: 'boolean',
      defaultsTo: false,
      columnName: 'is_confirmed'
    },
    emailProofToken: {
      type: 'string',
      description: 'This token is for the account email verification',
      columnName: 'email_proof_token'
    },
    emailProofTokenExpiresAt: {
      description: 'the amount of time in milliseconds when the emailProofToken will expire',
      columnName: 'email_proof_token_expires_at',
      type: 'ref',
      columnType: 'bigint',
      isNumber: true,
    }
  },

  customToJSON: function () {
    return _.omit(this, ["password"]);
  },

  beforeCreate: async function (values, proceed) {
    // Hash password
    const hashedPassword = await sails.helpers.passwords.hashPassword(
      values.password
    );
    values.password = hashedPassword;
    return proceed();
  }

};

