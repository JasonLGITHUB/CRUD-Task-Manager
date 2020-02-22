const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const transactRouter=require('./routers/transact')
const consumerRouter=require('./routers/consumer')
const merchantRouter=require('./routers/merchant')


const cookieParser = require('cookie-parser')

const app = express()
const morgan = require("morgan"); //----------------------------
const bodyParser = require("body-parser"); 
const expressSession = require('express-session')
const expressValidator = require('express-validator')

const path = require('path')
const hbs = require('hbs')

const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

const AutoNumeric = require('autonumeric');


//---------------------------------------
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)
app.use(express.static(publicDirectoryPath))

app.use(morgan("dev"));   //        no idea
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())

app.use(expressValidator())
app.use(expressSession({secret: 'maxErrormessage', saveUninitialized: false, resave: false}));

// app.use((req,res,next) => {
//     if (req.method =='GET') {
//         res.send('GET request are disabled')
//     }else {
//         next()
//     }
    
// })

// app.use((req, res, next) => {
//     res.status(503).send('Site is currently down, Check back soo !')
// })


const port = process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
app.use(transactRouter)
app.use(consumerRouter)
app.use(merchantRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})


//------------------------------------------------play ground------------------
// const Task = require('./models/task')
// const User = require('./models/user')

// const main=async () => {

//     // const task = await Task.findById('5de6e10e684cd9f3673d1dc0') // use task ID find Owner
//     // await task.populate('owner').execPopulate() 
//     // console.log(task.owner)

//     const user = await User.findById('5de6cd198723f5eb472b785b') //use owner iD find tasks
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }

// main()

// if (app.get('env') === 'development') {
//     app.use(function(err, req, res, next) {
//       res.status(err.status || 500);
//       res.render('error', {
//         message: err.message,
//         error: err
//       });
//     });
//   }
  
//   // production error handler
//   // no stacktraces leaked to user
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: {}
//     });
//   });

