exports.sendEmail=(req,res,next)=>{
    const { name, password, email, phone } = req.body;

    //only send email and msg when it's not a test
    if (!req.isTest) {
        // using Twilio SendGrid's v3 Node.js Library
        // https://github.com/sendgrid/sendgrid-nodejs
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: email, // Change to your recipient
            from: 'jyu205@myseneca.ca', // Change to your verified sender
            subject: 'Wlecome to FishStreaming',
            text: `Hi, ${name},welcome to FishStreaming, please enjoy the films`,
            html: `<h2>Hi, ${name},welcome to FishStreaming, please enjoy the films<h2>`,
        };
        sgMail
            .send(msg)
            .then(() => {
                console.log('Email sent');
            })
            .catch((error) => {
                console.error(error);
            })
    }
    next();
};

exports.sendMSG=(req,res,next)=>{
    const { name, password, email, phone } = req.body;

    //only send email and msg when it's not a test
    if (!req.isTest) {
             //set up the msg sending by Twiolio API
             const accountSid = process.env.accountSid;
             const authToken = process.env.authToken;
             const client = require('twilio')(accountSid, authToken);
 
             client.messages
                 .create({
                     body: `Hi, ${name},welcome to FishStreaming, please enjoy the films`,
                     from: '+12253965782',
                     to: phone
                 })
                 .then(message => console.log(message.sid))
                 .catch(error => console.log(`error happened during sending msg because of ${error}`)); 
    }
    next();
};