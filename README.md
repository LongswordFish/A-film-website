# A-film-website
A film website of web 322 assignment

########### project introduction

FishStreaming is a website that provides film listing, film searching, film purchassing services. 

This project uses node.js and express for the back-end and bootstrap for front-end.

Express-handlbars is used as the engine.

Express-session is used for keeping the status of the user.

########### key information

For registration, the email has to be unique; the password needs at least 8 char, one uppercase, one lowercase, one digit are needed.

Also for the registration, 10-digits of phone number is needed. For the test purpose, if you don't want to enter a valid phone, enter 0 instead. But you won't receive the welcome email and msg if you enter 0. 

If you don't want to register, try '2@2.com' as the email and 'Qq111111' as the psw for an ordinary user to sign in; '1@1.ca' and also 'Qq111111' for the admin account. 

Note: in the search function, it is case sentive. For example, searchsing 'Friends' will get the result while 'friends' will not.

########### Environment

node.js

express

engine:express-handlebars


########### Deployment

1. This project is deployed on Heroku. Check it here: https://fishstreaming.herokuapp.com/

2. If you want to run it locally, please do:

  2.1 install node.js and npm

  2.2 npm start //to install all libraries
  
  2.3 create a local config file including:
 
      2.3.1 accountSid //to use twillio to send email
 
      2.3.2 authToken //to use twillio to send email
     
      2.3.3 MONGODB_CONNECTION_STRING //to have the access to the mongoDB database
      
      2.3.4 SECRET_KEY // to use the session
      
      2.3.5 SENDGRID_API_KEY //to use twillio to send msg

########### Contact
Please contact with Robinyu9840@gmail.com if you have any questions.
