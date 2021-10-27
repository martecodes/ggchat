module.exports = (app, passport, db) => {
    // normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('messages').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : req.user
          })
        })
    });
    app.get('/valorant', isLoggedIn, function(req, res) {
        db.collection('valorant').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('valorant.ejs', {
            user : req.user,
            valorant: result
          })
        })
    });
    app.get('/warzone', isLoggedIn, function(req, res) {
        db.collection('warzone').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('warzone.ejs', {
            user : req.user,
            warzone: result
          })
        })
    });
    app.get('/apex', isLoggedIn, function(req, res) {
        db.collection('apex').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('apex.ejs', {
            user : req.user,
            apex: result
          })
        })
    });
    app.get('/overwatch', isLoggedIn, function(req, res) {
         db.collection('overwatch').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('overwatch.ejs', {
            user : req.user,
            overwatch: result
          })
       })
    });
    app.get('/csgo', isLoggedIn, function(req, res) {
         db.collection('csgo').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('csgo.ejs', {
            user : req.user,
            csgo: result
          })
       })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// message board routes ===============================================================

    app.post('/valorant', (req, res) => {
      let user = req.user
      let time = (new Date()).toLocaleString()

      db.collection('valorant').insert({ name: user.local.username, msg: req.body.msg, arrowUp: 0, time}, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/valorant')
      })
    })
    app.post('/apex', (req, res) => {
      let user = req.user
      let time = (new Date()).toLocaleString()

      db.collection('apex').insert({ name: user.local.username, msg: req.body.msg, arrowUp: 0, time}, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/apex')
      })
    })
    app.post('/warzone', (req, res) => {
      let user = req.user
      let time = (new Date()).toLocaleString()

      db.collection('warzone').insert({ name: user.local.username, msg: req.body.msg, arrowUp: 0, time}, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/warzone')
      })
    })
    app.post('/csgo', (req, res) => {
      let user = req.user
      let time = (new Date()).toLocaleString()

      db.collection('csgo').insert({ name: user.local.username, msg: req.body.msg, arrowUp: 0, time}, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/csgo')
      })
    })
    app.post('/overwatch', (req, res) => {
      let user = req.user
      let time = (new Date()).toLocaleString()

      db.collection('overwatch').insert({ name: user.local.username, msg: req.body.msg, arrowUp: 0, time}, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/overwatch')
      })
    })
  app.put('/arrowUp', (req, res) => {
    let user = req.user
    db.collection('valorant')
      .findOneAndUpdate({ name: user.local.username, msg: req.body.msg }, {
        $set: {
          arrowUp: req.body.arrowUp + 1
        }
      }, {
        sort: { _id: -1 },
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
  })

  app.put('/arrowDown', (req, res) => {
    let user = req.user
    db.collection('valorant')
      .findOneAndUpdate({ name: user.local.username, msg: req.body.msg }, {
        $set: {
          arrowUp: req.body.arrowUp - 1
        }
      }, {
        sort: { _id: -1 },
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
  })

  app.delete('/trash', (req, res) => {
    let user = req.user
    db.collection('valorant').findOneAndDelete({ name: user.local.username, msg: req.body.msg }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Message deleted!')
    })
  })
// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // signup =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}