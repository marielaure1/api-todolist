import express from 'express';
import Auth from '../controllers/authController.js';
import validation from '../services/validationService.js'; 

const authRouter = express.Router()

authRouter.post('/signup', validation.signupValidation, Auth.signup);
authRouter.post('/signup/confirm', Auth.activateAccount);
authRouter.post('/login', validation.loginValidation, Auth.login);

export default authRouter;