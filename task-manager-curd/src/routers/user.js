const express = require('express')
const multer = require('multer')
// const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
// const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')
// const { check, validationResult } = require('express-validator/check')

const router = new express.Router()


//-------------------------------home page------------------------------------------
router.get('', (req, res) => {
    res.render('index', {
        title: 'Check4DigiT',
        name: 'Axson Engineering DataBase'
    })
})

router.get('/succ', (req, res) => {
    res.render('succ', { user: new User() }) //render templates/succ.hbs
  })
//----------------------------------------------------- below add new user--------------------
router.get('/as_agent', (req, res) => {
    res.render('users/as_agent', { user: new User() }) //render templates/users/new.hbs
  })

  router.get('/error', (req, res) => {
    res.render('users/errorPage', { user: new User(), title: 'Error messages', success: req.session.success, errors: req.session.errors }) //render templates/users/new.hbs
    req.session.errors = null;
  })

router.get('/newuser', (req, res) => {
    res.render('users/new', { user: new User() }) //render templates/users/new.hbs
  })
  router.post('/users', async (req, res) => {

    const user = new User(req.body)

    try {
        await user.save()
        // sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.cookie('auth_token', token)
        res.redirect('/users/login')
        // res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/users/login', (req, res) => {
    res.render('users/login', { user: new User() }) //render users/login.hbs
  })
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.cookie('auth_token', token)
        
        // res.send({ user, token })
        // res.redirect('/tasks')
        res.redirect('/users/me')
       
    } catch (e) {
         res.status(400).send()
       
    }
    
})

router.get('/users/logout', (req, res) => {
    res.render('users/logout', { user: new User() }) //render users/logout.hbs
  
  })
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        // res.send()
        res.redirect('/') //back to home page
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/logoutAll', (req, res) => {
    res.render('users/logoutAll', { user: new User() }) //render users/logout.hbs  
  })
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        //res.send()
        res.redirect('/')
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res) => {
    // res.send(req.user)
     res.render('users/user-me', {'myProfile' : req.user}) //  User profile data table 
})

router.get('/users/:id/update', auth, async (req, res) => {
    // res.send(req.user)
     res.render('users/user_me_patch', {'myProfile' : req.user})     // user profile update UI form 
})

router.post('/users/:id/update', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['_id','name', 'email', 'password', 'age']   // if there is no '_id ', is not valid...false
    console.log(updates)
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    console.log(isValidOperation)
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try { 
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})
//----------------------------------------"User validation failed: _id: Cast to ObjectID failed for value "" at path "_id"", !!-----why ?--------------------

// router.post("/users/me/update", auth,(req, res, next) => {
//      const id = req.params.id;
   
//      const updateOps = {};
//     for (const ops of Object.keys(req.body)) {
//       updateOps[ops.name] = ops.value;
//     }
//     User.update({ _id: id }, { $set: updateOps })
   
//       .exec()
//       .then(result => {
//         console.log(result);
//         res.status(200).json(result);
//       })
//       .catch(err => {
//         console.log(err);
//         res.status(500).json({
//           error: err
//         });
//       });
//   });
//----------------------------------------------------------------ok:0 modify:0 n:0------------------------------------------------------
// router.post("/users/me/update", auth, (req,res) => {      

//     const id = Object.keys(req.body._id)
//    User.findByIdAndUpdate({_id:id},Object.keys(req.body),{new:true},(err,doc) => {
//         if(!err){
//             res.redirect('users/me');
//         }
//         else{
//             if(err.name == "ValidationError")
//             {
//                 handleValidationError(err,req.body);
//                 res.render("users/newup",{
//                     viewTitle:'Update User',
//                     user:req.body
//                 });
//             }
//             else{
//                 console.log("Error occured in Updating the records" + err);
//             }
//         }
//     })
// })
//---------------------------------------CastError: Cast to ObjectId failed for value "{ _id: '' }" at path "_id" for model "User"---?---//
router.get('/users/me/delete', auth, async (req, res) => {  //----------delete user
    try {
        await req.user.remove()
        //res.send(req.user)
        res.redirect('/')
    } catch (e) {
        res.status(500).send()
    }
})


module.exports = router
