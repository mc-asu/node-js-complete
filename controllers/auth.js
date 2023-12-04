const User = require('../models/user')

exports.getLogin = (req, res, next) => {
    res.render('auth/login', { 
        pageTitle: 'Login', 
        path: '/login',
        isAuthenticated: req.session.isLoggedIn
    })
}

exports.postLogin = (req, res, next) => {
    User.findById('656dae0134057beabb4527d6').then(user => {
        req.session.isLoggedIn = true
        req.session.user = user
        res.session.save((err) => {
            console.log(err)
            res.redirect('/')
        })
    }).catch(err => console.log(err))
}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err)
        res.redirect('/')
    })
}