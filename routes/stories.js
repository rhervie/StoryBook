const express = require('express');
const router = express.Router();
const {endsureAuth} = require('../middleware/auth')
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
// @desc   Show all stories
// @route GET / stories/
 router.get('/',endsureAuth, async (req,res)=>{
   try {
     const stories = await Story.find({ status: 'public'})
     .populate('user')
     .sort({createdAt:'desc'})
     .lean()
     res.render('stories/index' ,{
      stories,
     })
   } catch (err) {
      console.error(err)
      res.render('error/500') 
   }
 })
 // @description Show single story
// @route GET/stories/:id
router.get('/:id',endsureAuth, async(req,res)=>{
 try{
   let story = await Story.findById(req.params.id)
   .populate('user')
   .lean()
   
   if (!story) {
    return res.render('error/404')
   }
   res.render('stories/show',{
    story,
   })
 } catch(err) {
   console.error() 
   res.render('error/404')
 }
})
 // @desc   Show edit Story
// @route GET / stories/edit/:id
router.get('/edit/:id',endsureAuth,async (req,res)=>{
  try {
    const story = await Story.findOne({
      _id: req.params.id,
    }).lean()
      if (!story) {
        return res.render('error/404')
      }
      if (story.user != req.user.id){
        res.render('/stories')
      } else {
        res.render('stories/edit',{
          story,
        })
      }
  } catch(err) {
    console.error(err)
    return res.render('error/500')
  }
  
  })

  // @description Update Story
// @route PUT / stories/id
router.put('/:id',endsureAuth, async (req,res)=>{
  try {
    let story = await Story.findById(req.params.id).lean()
    if (!story) {
     return res.render('error/404')
   }
   if (story.user != req.user.id){
     res.render('/stories')
   } else {
       story = await Story.findOneAndUpdate({_id: req.params.id}, req.body,{
         new: true, 
         runValidators: true,
       })
       res.redirect('/dashboard')
   }
  } catch(error) {
    console.error(err)
    return res.render('error/500')
  }
 
})
router.delete('/:id',endsureAuth, async(req,res)=>{
  try {
    await Story.remove({_id: req.params.id})
    res.redirect('/dashboard')
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})
// @description User Stories
// @route GET /stories/user/:userId
router.get('/user/:userId',endsureAuth, async(req,res)=>{
  try {
   const stories = await Story.find({
    user: req.params.userId,
    status:'public',
  })
    .populate('user')
    .lean()
    res.render('stories/index',
    stories
    )
  } catch(err) {
    console.error(err)
    res.render('error/500')
  }
})
module.exports = router