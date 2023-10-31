import express from 'express';
import Test from '../controllers/testController.js';

const testRouter = express.Router()

testRouter.delete('/user/:email', Test.deleteUserByEmail);

export default testRouter;