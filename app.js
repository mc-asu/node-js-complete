const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const User = require('./models/user')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); 

app.use((req, res, next) => {
    User.findById('656dae0134057beabb4527d6').then(user => {
        req.user = user
        next()
    }).catch(err => console.log(err))
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404); 

const username = 'manuelcasupanan'
const password = 'BTCsgCW0T7JHiXuW'
const mongoDbUrl = `mongodb+srv://${username}:${password}@nodejscourse.tdqni9o.mongodb.net/shop?retryWrites=true&w=majority`
mongoose.connect(mongoDbUrl)
    .then(result => {
        User.findOne().then(user => {
            if(!user) {
                const user = new User({
                    name: 'Manuel',
                    email: 'mc@gmail.de',
                    cart: {
                        items: []
                    }
                })
                user.save()
            }
        })
        app.listen(3000)
    }).catch(err => console.log(err))
 