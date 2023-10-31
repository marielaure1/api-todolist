import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import TemporaryUser from '../models/TemporaryUser.js';
import Token from "../services/tokenService.js"
import Mail from "../services/mailService.js"
import dotenv from 'dotenv';

dotenv.config();
const {JWT_KEY} = process.env

export default {
  async signup(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.error("Auth > SignUp > errors : ", errors);
      return res.status(422).json({ errors: errors.array() });
    }

    try {
        const { name, email, password} = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
          console.error("Auth > SignUp > existingUser : ", existingUser);
            return res.status(422).json({ success: false, message: 'Cet utilisateur existe déjà' });
        }

        const existingTemporaryUser = await TemporaryUser.findOne({ email });

        if (existingTemporaryUser) {
          console.error("Auth > SignUp > existingTemporaryUser : ", existingTemporaryUser);
            return res.status(422).json({ success: false, message: 'Cet utilisateur doit confirmer son email' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const token = Token.generateToken(email);

        const temporaryUser = new TemporaryUser({ name, email, password: hashedPassword, token });
        await temporaryUser.save();

        await Mail.sendMail({ token, email }, "confirmation inscription");

        return res.status(201).json({ 
          success: true, 
          message: "Inscription réussie. Vérifiez votre e-mail pour l'activation.", 
          data: {
              token,
              temporaryUser
          }
        });
    } catch (error) {
      console.error("Auth > Signup : ", error);
      return res.status(500).json({ success: false, message: "Erreur lors de l'inscription" });
    }
  },
  async activateAccount(req, res) {
    const { token } = req.query;

    try {
      const temporaryUser = await TemporaryUser.findOne({ token });

      if (!temporaryUser) {
        console.error("Auth > ActiveAccount > TemporaryUser : ", temporaryUser);
        return res.status(422).json({ success: false, message: "Lien d'activation non valide" });
      }

      const { name, email, password } = temporaryUser;
      const user = new User({ name, email, password });
      await user.save();

      await temporaryUser.deleteOne({'_id': temporaryUser._id});

      const tokenJWT = jwt.sign({ userId: user._id }, JWT_KEY, { expiresIn: '2d' });

      return res.status(200).json({ 
        success: true, 
        message: 'Compte activé avec succès',
        data: {
            token: tokenJWT,
            user
        }
    });
    } catch (error) {
      console.error("Auth > ActiveAccount : ", error);
      return res.status(500).json({ success: false, message: "Erreur lors de l'activation du compte" });
    }
  },
  async login(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.error("Auth > Login > Errors : ", errors);
      return res.status(422).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        console.error("Auth > Login > User: ", user);
        return res.status(401).json({ message: 'Identifiants incorrects' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        console.error("Auth > Login > PasswordMatch: ", passwordMatch);
        return res.status(401).json({ message: 'Identifiants incorrects' });
      }

      const token = jwt.sign({ userId: user._id }, JWT_KEY, { expiresIn: '2d' });

      return res.status(200).json({ token, user });
    } catch (error) {
      console.error("Auth > Login > Token: ", error);
      return res.status(500).json({ success: false, message: 'Erreur lors de la connexion' });
    }
  }
};
