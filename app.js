const path = require('path')
const express = require('express')
const mongoose =  require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const cors = require("cors")
const passport =require('passport')
const session = require('express-session')
const MongoStore= require('connect-mongo')
const connectDB = require('./config/db')
// Load Configure
dotenv.config({path:'./config/config.env'})
// Passport config
require('./config/passport')(passport)
// Db Connection
connectDB()
const app = express()
//  Body Parser
app.use(express.urlencoded({extended:false}))
app.use(express.json());
//  Enable course
app.use(cors())
//http
if (process.env.NODE_ENV ==='development') {
    app.use(morgan('dev'))
}
// Static  folder
app.use(express.static(path.join(__dirname,'public')))
// Handlebars
app.engine('.hbs',exphbs.engine({defaultLayout: "main", extname: '.hbs' }));
app.set('view engine', '.hbs');
// Sessions
app.use(
  session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
  })
})
)
// Passport middleware
app.use(passport.initialize())
app.use(passport.session())
//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/auth/logout',require('./routes/auth'))
app.use('/stories', require('./routes/stories'))
// Server
const PORT = process.env.PORT || 3000
app.listen(PORT,  console.log(`Server Running on ${process.env.NODE_ENV} mode on port ${PORT}`))
