import express from 'express';
import routes from './routes.js';
import http from 'http'
import { initSocket } from './sockets/socket.js';
import cors from 'cors';

const app = express()
const port = 3001

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use("/api/v1", routes);

const server = http.createServer(app)
initSocket(server)

server.listen(port, () => {console.log(`Server is running on port ${port}`)});