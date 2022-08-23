const express = require('express');
const router = express.Router();
const { endsureAuth} = require('../middleware/auth')
const Story = require('../models/Story')
// @description Show add page
// @route GET / stories/add
router.get('/add',endsureAuth,(req,res)=>{
    res.render('stories/add') 
})
// @Description Process and form
// @route POST / stories
router.post('/',endsureAuth, async (req,res)=>{
   try{
      req.body.user = req.user.id
      await Story.create(req.body)
      res.redirect('/dashboard')
   } catch(err) {
     console.error(err)
     res.render('error/500')
   }
})

module.exports = router