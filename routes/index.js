const express = require('express');
const router = express.Router();
const {endsureAuth, endsureGuest} = require('../middleware/auth')
const Story = require('../models/Story')

// Login/Landing Page
// @route GET / 
router.get('/', endsureGuest,(req,res)=>{
    res.render('login', 
    {layout:'login',
})
})
// Dashboard
// @route GET / 
router.get('/dashboard', endsureAuth, async (req,res)=>{
    try{
       const stories = await Story.find({user:req.user.id}).lean()
       res.render('Dashboard', {
        name: req.user.firstName,
        stories
    })
    } catch(err) {
        console.error(err)
        res.render('error/500')
    }
  
})

module.exports = router

