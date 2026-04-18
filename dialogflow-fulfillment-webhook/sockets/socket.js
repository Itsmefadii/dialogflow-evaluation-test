import { Server, Socket } from "socket.io";
import { detectIntent } from "../dialogflow/dialogflow.service.js";

// maps sessionId -> socketId to route messages back to the right user
let clients = {};
let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected: ", socket.id);

    // client registers their sessionId so we can find them later
    socket.on("register", (sessionId) => {
      clients[sessionId] = socket.id;
    });

    // forward user message to dialogflow, response comes back via webhook
    socket.on("send_message", async ({ message, sessionId }) => {
      try {
        await detectIntent(message, sessionId);
      } catch (error) {
        console.error("Error sending to Dialogflow:", error);
      }
    });

    // clean up the client entry when they disconnect
    socket.on("disconnect", () => {
      for (let key in clients) {
        if (clients[key] === socket.id) {
          delete clients[key];
        }
      }
    });
  });
};

// webhook uses this to find which socket to send the agent reply to
export const getClientSocket = (sessionId) => {
  console.log(clients[sessionId]);
  return clients[sessionId];
};

export const getIo = () => io;