const path = require('path')

const User = require('../models/user')

const express = require('express')

const { check, body} = require('express-validator')

const authController = require('../controllers/auth')

const router = express.Router()

router.get('/login',authController.getLogin)

router.get('/signup', authController.getSignup)

router.get('/reset', authController.getReset)

router.get('/reset/:token', authController.getNewPassword)

router.post(
    '/login',
    [
        check('email')
            .isEmail()
            .withMessage('Please enter a valid email address.')
            .normalizeEmail(),
        body('password', 'Password incorrect')
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim()
    ],
    authController.postLogin
)

router.post(
    '/signup',
    [
        check('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .normalizeEmail()
            .custom((value, {req}) => {
                return User
                    .findOne( { email: value})
                    .then(userDoc => {
                        if(userDoc) {
                            return Promise.reject('Email exists already, please pick a different one.')
                        }
                    })
            }),
        body('password', 'Please enter a password with only numbers and text and at least 5 characters.')
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim(),
        body('confirmPassword')
            .trim()
            .custom((value, {req}) => {
                if(value !== req.body.password) {
                    throw new Error('Passwords have to match!')
                }
                return true
            })
        
    ],
    
    authController.postSignup
)

router.post('/logout', authController.postLogout)

router.post('/reset', authController.postReset)

router.post('/new-password', authController.postNewPassword)


module.exports = router
