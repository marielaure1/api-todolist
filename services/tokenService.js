import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const {JWT_KEY} = process.env

export default{
    generateToken(data) {
      
        const token = jwt.sign({data}, JWT_KEY, {
            algorithm: "HS256",
            expiresIn: "2d",
        })

        return token;
    }
}