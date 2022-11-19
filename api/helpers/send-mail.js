const nodemailer = require("nodemailer");
var nodemailerSendgrid = require("nodemailer-sendgrid");
const hbs = require("nodemailer-express-handlebars");

module.exports = {


  friendlyName: 'Send mail',


  description: '',


  inputs: {
    params: {
      type: "ref",
      required: true
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {
    const transporter = nodemailer.createTransport(
      nodemailerSendgrid({
        apiKey: sails.config.sendGridAPIkey || process.env.SENDGRID_API_KEY,
      })
    );
    transporter.use(
      "compile",
      hbs({
        viewEngine: {
          extName: ".hbs",
          partialsDir: "./views",
          layoutsDir: "./views",
          defaultLayout: "",
        },
        viewPath: "./views/",
        extName: ".hbs",
      })
    );
    try {
      let emailOptions = {
        from: "torrebooks <torrebooks@gmail.com>",
        ...inputs.params
      };
      await transporter.sendMail(emailOptions);
    } catch (error) {
      sails.log(error);
    }
  }
};

