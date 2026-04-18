import dialogflow from "@google-cloud/dialogflow";
import { v4 as uuidv4 } from "uuid";

// project ID from dialogflow console
const projectId = "diaglogflow-snsx"

// one client instance handles all sessions
const sessionClient = new dialogflow.SessionsClient({
    keyFilename: "./config/dialog-flow-service-account.json"
})

export const detectIntent = async (text, sessionId) => {
    // sessionId keeps conversation context across multiple messages
    console.log("Session ID:", sessionId);

    // session path tells dialogflow which agent + session to use
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

    console.log("Session Path:", sessionPath);

    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: text,
                languageCode: "en"
            }
        }
    }

    // send user message, get back matched intent + response
    const responses = await sessionClient.detectIntent(request)

    const result = responses[0].queryResult;
}