import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const { JWT_KEY } = process.env

export default {
  authenticateToken(req, res, next) {
    const authorization = req.headers['authorization'];
    const token = authorization && authorization.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'Accès non autorisé. Vous devez vous connecté.' });
    }
  
    try {
      const payload = jwt.verify(token, JWT_KEY);

      res.userId = payload.userId;
  
      next();
    } catch (error) {
      return res.status(403).json({ message: 'Accès refusé. Token invalide.' });
    }
  }
}