import Mail from './services/mailService.js';
import Token from './services/tokenService.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const {JWT_KEY} = process.env

// describe('services/tokenService', () => {

//     test('Test de la génération de jeton avec JWT', () => {
//         const email = "edjour.marielaure@gmail.com";
//         const token = Token.generateToken(email);

//         const payload = jwt.verify(token, JWT_KEY);

//         expect(payload.email).toBe(email);
//     })
// })
