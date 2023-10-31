import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// Routes
import authRouter from './routers/authRouter.js';
import taskRouter from './routers/taskRouter.js';
import testRouter from './routers/testRouter.js';
import AuthentificationMiddleware from './middlewares/authentificationMiddleware.js';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const {DB_USER, DB_PASSWORD, DB_NAME} = process.env;

mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_NAME}?retryWrites=true&w=majority`,{ useNewUrlParser: true, useUnifiedTopology: true})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "ERROR: CANNOT CONNECT TO MONGO-DB"));
db.on("open", () => console.log("CONNECTED TO MONGO-DB"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const router = express.Router();
router.use('/auth', authRouter);
router.use('/tasks', AuthentificationMiddleware.authenticateToken, taskRouter);
router.use('/test', testRouter);
app.use("/api", router);

const server = app.listen(port, () => {
  console.log(`Serveur Express lancé sur le port ${port}`);
});

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;