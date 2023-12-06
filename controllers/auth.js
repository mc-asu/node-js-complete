const crypto = require('crypto')

const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const { validationResult } = require('express-validator')


const User = require('../models/user')
const userEmail = 'manuel.casupanan@gmail.com'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: userEmail,
        pass: 'randompassword',
    }
    //usegmail for this and use apppassword
})

exports.getLogin = (req, res, next) => {
    let message = req.flash('error')
    if(message.length > 0) {
        message = message[0]
    } else {
        message = null
    }
    res.render('auth/login', { 
        pageTitle: 'Login', 
        path: '/login',
        errorMessage: message,
        oldInput: { 
            email: '', 
            password: '', 
        },
        validationErrors: []
    })  
}

exports.postLogin = (req, res, next) => {
    const { email, password } = req.body
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(422).render('auth/login', { 
            pageTitle: 'Login', 
            path: '/login',
            errorMessage: errors.array()[0].msg,
            oldInput: { 
                email: email, 
                password: password
            },
            validationErrors: errors.array()
        })
    }
    User.findOne( { email: email})
    .then(user => {
        if(!user) {
            return res.status(422).render('auth/login', { 
                pageTitle: 'Login', 
                path: '/login',
                errorMessage: 'Invalid email or password.',
                oldInput: { 
                    email: email, 
                    password: password
                },
                validationErrors: []
            })
        }

        bcrypt
            .compare(password, user.password)
            .then((doMatch) => {
                if (doMatch) {
                    req.session.isLoggedIn = true
                    req.session.user = user
                    return req.session.save((err) => {
                        console.log(err)
                        res.redirect('/')
                    })
                }
                return res.status(422).render('auth/login', { 
                    pageTitle: 'Login', 
                    path: '/login',
                    errorMessage: 'Invalid email or password.',
                    oldInput: { 
                        email: email, 
                        password: password
                    },
                    validationErrors: []
                })
            }).catch(err => console.log(err))

    }).catch(err => console.log(err))
}

exports.getSignup = (req, res, next) => {
    let message = req.flash('error')
    if(message.length > 0) {
        message = message[0]
    } else {
        message = null
    }
    res.render('auth/signup', { 
        pageTitle: 'Signup', 
        path: '/signup',
        errorMessage: message,
        oldInput: { 
            email: '', 
            password: '', 
            confirmPassword: '' 
        },
        validationErrors: []

    })
}

exports.postSignup = (req, res, next) => {
    const { email, password, confirmPassword } = req.body
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(422).render('auth/signup', { 
            pageTitle: 'Signup', 
            path: '/signup',
            errorMessage: errors.array()[0].msg,
            oldInput: { 
                email: email, 
                password: password, 
                confirmPassword: confirmPassword 
            },
            validationErrors: errors.array()
        })
    }
        bcrypt
            .hash(password, 12)
            .then((hashedPassword) => {
                const user = new User({
                    email: email,
                    password: hashedPassword,
                    cart: { items: [] }
                })
                return user.save()
            })
            .then(result => {
                res.redirect('/login')

                return transporter.sendMail({
                    to: email,
                    from: userEmail,
                    subject: 'Signup succeeded!',
                    html: '<h1> You successfully signed up! </h1>'
                }).catch(err => console.log(err))
            })
}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err)
        res.redirect('/')
    })
}

exports.getReset = (req, res, next) => {
    let message = req.flash('error')
    if(message.length > 0) {
        message = message[0]
    } else {
        message = null
    }
    res.render('auth/reset', { 
        pageTitle: 'Reset Password', 
        path: '/reset',
        errorMessage: message
    })
}

exports.postReset = (req, res, next) => {
    const {email} = req.body
    crypto.randomBytes(32, (err, buffer) => {
        if(err) {
            console.log(err)
            return res.redirect('/reset')
        }
        const token = buffer.toString('hex')
        User.findOne({ email: email }).then((user) => {
            if(!user) {
                req.flash('error', 'No account with that email found.')
                return res.redirect('/reset')
            }
            user.resetToken = token
            user.resetTokenExpiration = Date.now() + 3600000
            return user.save()
        })
        .then((result) => {
            res.redirect('/')
            transporter.sendMail({
                to: email,
                from: userEmail,
                subject: 'Password reset',
                html: `
                    <p> You requested a password reset </p>
                    <p> Click this <a href="https://localhost:3000/reset/${token}"> link </a> to set a new password </p>
                    `
            })
        }).catch(err => console.log(err))
    })
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token
    User.findOne( { resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
        .then((user) => {
            let message = req.flash('error')
            if(message.length > 0) {
                message = message[0]
            } else {
                message = null
            }
            res.render('auth/new-password', { 
                pageTitle: 'New Password', 
                path: '/new-password',
                errorMessage: message,
                userId: user._id.toString(),
                passwordToken: token
            })
        })
        .catch(err => console.log(err))

}

exports.postNewPassword = (req, res, next) => {
    const { password, userId, passwordToken } =  req.body
    let resetUser
    User.findOne({ resetToken: passwordToken, resetTokenExpiration: {$gt: Date.now()}, _id: userId})
        .then((user) => {
            resetUser = user
            return bcrypt
                .hash(password, 12)
        })
        .then((hashedPassword) => {
            resetUser.password = hashedPassword
            resetUser.resetToken = undefined
            resetUser.resetTokenExpiration = undefined
            return resetUser.save()
        }).then((result) => {
            res.redirect('/login')
        })
        .catch(err => console.log(err))
}
