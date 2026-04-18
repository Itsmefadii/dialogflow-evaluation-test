1) To run the backend first of all you need to install all the packeages using command:
npm install --force 

2) After installation of the packeges you need to run the project by using:
npm run dev

3) To expose webhook you need to install ngrok and write command 
ngrok http 3001

OVERVIEW OF THE PROJECT:
Let me explain the folder structure.
The config contains all the secrets and credentials to communicate with the dialog flow
Than we have dialoglfow floder in which I have integrated the dialogflow 
Than we have socket folder in which i have setup my websocket which is socket.io
In webhook folder i have handled webhook functionality
In routes.js I have defined the routes for the webhook
The server.js file is where every thing will bootup

In server.js you can see --http.createServer-- instead of app.listen because socket.io need access to the raw HTTP server to upgrade connections to websockets.

In dialogflow.service.js I have implemented the dialogflow SDK. It is taking 2 parameters message and sessionId. The message is passed to the detect intent function. Base on the message the dialog flow will identify which intent is called and it will give response via webhook.

socket.js: This is the heart of the architechture.

let clinets={}
This is a simple in-memory map of sessionId and socketId. So the question raises why are we creating this map. When the user will connects to the websocket it needs to register themselves, upon registering it will create a map. When the webhook will respond it will give the sessionPath like projects/my-project/agent/sessions/abc123 we only care about abc123 so we take out this value and will pass as a parameter to our function and take out the session id we mapped in clients object, so that we send the response of dialogflow backend to session where the  socket received the message. And when a user disconnects, we loop through the clients map and delete their entry — so we don't keep dead socket IDs hanging around in memory.