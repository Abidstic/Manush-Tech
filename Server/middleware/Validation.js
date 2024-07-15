import { body, param, validationResult } from 'express-validator';

export const itemValidationRules = () => {
    return [
        body('itemName').notEmpty().withMessage('Item name is required'),
        body('category').notEmpty().withMessage('Category is required'),
    ];
};

export const userValidationRules = () => {
    return [
        body('email').isEmail().withMessage('Must be a valid email'),
        body('password')
            .isLength({ min: 5 })
            .withMessage('Password must be at least 5 characters long'),
    ];
};

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    console.log('here');
    const extractedErrors = [];
    errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));
    return res.status(422).json({
        errors: extractedErrors,
    });
};
