const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const User = require('./models/user')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); 

app.use((req, res, next) => {
    User.findById('6568f66fd32f83aac8f875d9').then(user => {
        req.user = user
        next()
    }).catch(err => console.log(err))
    next()
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404); 

mongoConnect(() => {
    // const user = new User('manuelcasupanan', 'mc@gmail.com')
    // user.save().then(() => {
    //     console.log('User created')
    // }).catch(err => {
    //     console.log(err)
    // })
    // const user2 = new User('jasmindreistein', 'jd@gmail.com')
    // user2.save().then(() => {
    //     console.log('User created')
    // }).catch(err => {
    //     console.log(err)
    // })
    app.listen(3000)
})
