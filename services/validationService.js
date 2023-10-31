import { check } from 'express-validator';

export default {
    signupValidation: [
        check('name', 'Le nom est requis').notEmpty(),
        check('email', 'Adresse e-mail non valide').isEmail(),
        check('password', 'Le mot de passe doit contenir au moins 6 caractères').isLength({ min: 8 }),
    ],
    loginValidation: [
        check('email', 'Adresse e-mail non valide').isEmail(),
        check('password', 'Le mot de passe est requis').not().isEmpty(),
    ],
    taskValidation: [
        check('title', 'Le titre de la tâche est requis').notEmpty(),
        check('body', 'Le corps de la tâche est requis').notEmpty(),
        check('completed', 'La valeur de complétion doit être un booléen').optional().isBoolean(),
    ]
};