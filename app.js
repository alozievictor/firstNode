const express = require('express');
const expressLayout =  require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport'); 

const app = express();

require('./config/passport')(passport);

    // connection to my data base 
const db = require('./config/keys').MongoURI;
mongoose.connect(db, {useNewUrlParser: true})
.then(()=> console.log('mongodb connected'))
.catch(err => console.log(err))

app.use(expressLayout);
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false }))

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

app.use (passport.initialize());
app.use(passport.session());

app.use(flash()); 

app.use((req, res, next ) => {
    res.locals.success_msg = req.flash('success-msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next(); 
});


// using the router here in the app 
app.use('/', require('./routes/index'));

app.use('/users', require('./routes/users'))


const PORT = process.env.PORT || 3000;



app.listen(PORT, console.log(`app runing at port ${PORT}`))