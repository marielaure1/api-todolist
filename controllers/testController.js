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
  async deleteUserByEmail(req, res) {
    const { email } = req.params;

    console.log("test :", req);

    try {
      const user = await User.findOneAndDelete({email});

      if (!user) {
        return res.status(404).json({ success: false, message: 'User non trouvée' });
      }

      return res.status(200).json({ success: true, message: 'User supprimée avec succès' });
    } catch (error) {
      console.error("User > Delete : ", error);
      return res.status(500).json({ success: false, message: 'Erreur serveur interne' });
    }
  },
};
