const express = require('express');
const router = express.Router();
const user = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');

router.get('/Login', (req, res) => res.render('login'));

router.get('/Register', (req, res) => res.render('register'));

router.post('/register', (req, res)=>{
    const { name, email, password, password2 } = req.body;
    let error = [];

    if(!name || !email || !password || !password2){
       error.push({msg : 'Please fill all field provided'});
    }

    if(password !== password2){
        error.push({msg : 'password do not match'})
    }

    if(password.length < 6){
        if(password.length > 15){
            error.push({mse : 'password to long'})
        }
        error.push({msg : "password should be at list six characters"})
    }

    if(error.length > 0){
        res.render('register', {error, name, email, password, password2});
    }else{
        user.findOne({email: email})
        .then(allUser => {
            if(allUser){
                error.push({msg: 'Email is already registerd'})
                res.render('register', {
                    error,
                    name,
                    email,
                    password,
                    password2
                });
            } else{ 
                const newUser = new user({
                    name,
                    email,
                    password
                });
                 //password
                 bcrypt.genSalt(10,(err, salt)=> 
                 bcrypt.hash(newUser.password,salt, (err, hash)=>{
                    if(err) throw err;
                    
                     newUser.password = hash;
                     newUser.save()
                     .then(user =>{
                         req.flash('sucess_msg', 'Done you can noe log-in')
                        res.redirect('/users/login')
                     }).catch(err => console.log(err + " its not working yet"));
                 }))
            }
        });
    }
}); 

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect:  '/dashboard', 
        failureRedirect: '/users/login',
        failureFlash: true
    }) (req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'you are log out')
    res.redirect('/users/login')

})

module.exports = router; 