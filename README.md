# Caremonger
Caremonger is a solution to match those in need of help with those who want to help community by leveraging ML/Bots and scalable application.

# Steps to run the application
1. Open you cloud platform web ide and clone the repository there as a new project.
2. Open you cloud platform cockpit and create a user provided service with the instance_name CAI_TEXT_ANALYZER and with following content      in credentials.
   {
    "desc": "SAP CAI Text Analyzer",
    "developerToken": "Token <cai_developer_token>",
    "url": "https://api.cai.tools.sap/"
   }
   Replace <cai_developer_token> with you developer token of your SAP Conversational AI project's bot.
3. Build caremonger_db module.
4. Run caremonger_service as a node js application.
5. Replace the url of the caremonger_service in caremonger_ui/webapp/controller/Main.controller.js and 
   caremonger_ui/webapp/controller/Object.controller.js
6. Run the caremonger_ui as web application.

# Todo
1. Create dashboard for processor's registration and login.
2. Provide caremonger_service url in caremonger_ui dynamically.
3. Enable UAA service for authentication.
4. Make service call of bot for multiple entries in csv file.
5. Make changes for one to many relation of processor to procession locations.
   
