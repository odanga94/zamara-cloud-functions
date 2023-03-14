const functions = require("firebase-functions");
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function main(staffEmail, staffName, type) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  try {
    let transporter = nodemailer.createTransport({
      host: "mail.smtpbucket.com",
      port: 8025,
      /*     secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      }, */
    });

    /* transporter.verify(function (error, success) {
      if (error) {
        console.log("Verify Error", error);
      } else {
        console.log("Server is ready to take our messages");
      }
    }); */

    // send mail with defined transport object
    // let info = await transporter.sendMail({
    //   from: "admin@zamara.com", // sender address
    //   to: staffEmail, // list of receivers
    //   subject: /* `Profile Notification ${
    //     type === "created"
    //       ? "#Created"
    //       : type === "updated"
    //       ? "#Updated"
    //       : "#Deleted"
    //   }` */ "Profile Notification #Updated", // Subject line
    //   text: /* `Greeting ${staffName}, we are ${
    //     type === "created" || type === "updated" ? "glad" : "sad"
    //   } to inform you that your staff profile has been ${type}.` */ "Greeting John Odanga, we are glad to inform you that your staff profile has been updated", // plain text body
    //   html: /* `<b>Greeting ${staffName}, we are ${
    //     type === "created" || type === "updated" ? "glad" : "sad"
    //   } to inform you that your staff profile has been ${type}.</b>` */"<b>Greeting John Odanga, we are glad to inform you that your staff profile has been updated ", // html body
    // });

    let info = await transporter.sendMail({
      from: "admin@zamara.com>", // sender address
      to: /* "bar@example.com" */ staffEmail, // list of receivers
      // subject: "Hello ✔", // Subject line
      subject: `Profile Notification ${
        type === "created"
          ? "#Created"
          : type === "updated"
          ? "#Updated"
          : "#Deleted"
      }`, // "Profile Notification #Updated", // Subject line
      text: `Greeting ${staffName}, we are ${
        type === "created" || type === "updated" ? "glad" : "sad"
      } to inform you that your staff profile has been ${type}.`,
      // text: "Hello world?", // plain text body
      // html: "<b>Hello world?</b>", // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  } catch (err) {
    console.log("sending error", err.message);
  }
}

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
exports.sendEmail = functions.https.onRequest((request, response) => {
  console.log("reqBodyType", typeof request.body);
  const { staffEmail, staffName, type } = request.body;
  console.log("sEmail", staffEmail);
  main(staffEmail, staffName, type).catch(console.error);
  // functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Email sent!");
});
