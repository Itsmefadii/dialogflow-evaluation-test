import express from "express";
import { getClientSocket, getIo } from "../sockets/socket.js";

const router = express.Router();

// dialogflow hits this endpoint after processing user's message
router.post("/", (req, res) => {
  try {
    console.log("Body: ", req.body);

    const intent = req.body.queryResult.intent.displayName;

    // session format: projects/my-projects/agent/sessions/abc123
    // grab only the last part (the actual session ID)
    const session = req.body.session;
    const sessionId = session.split("/").pop();

    // use dialogflow's response or fallback message
    let response =
      req.body.queryResult.fulfillmentText || "Something went wrong";

    // find which socket belongs to this session
    const socketId = getClientSocket(sessionId);
    console.log(socketId)

    // push the agent reply directly to the user's browser
    const io = getIo()
    if (socketId) {
      io.to(socketId).emit("receive_message", {
        message: response,
        from: "agent"
      });
    }

    // still send response back to dialogflow to close the webhook cycle
    res.json({
      fulfillmentText: response,
    });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

export default router