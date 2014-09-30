var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose')
    User = require('./app/models/user'),
    bcrypt = require('bcrypt'),
    oauth2lib = require('oauth20-provider'),
    oauth2 = new oauth2lib({log: {level: 2}});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(oauth2.inject());

mongoose.connect('mongodb://localhost:27017');

var port = process.env.PORT || 8080,
    router = express.Router();

router.use(function(req,res,next){
    console.log('Event triggered');
    next();
});

/** API ROUTES **/
router.route('/users')
    //CREATE
    .post(function(req,res){
        //if(auth(req.body.username,req.body.password)){

          var user = new User();
          user.name = req.body.name;
          user.pass = bcrypt.hashSync(req.body.pass,8);
          user.email= req.body.email;
          user.fname = req.body.fname;
          user.avatar = req.body.avatar;
  
          user.save(function(err){
            if(err)
              res.send(err);
  
          res.json({ message: 'User created' });
          });
        //}
    })
    //READ
    .get(function(req, res){
        //if(auth(req.body.username,req.body.password)){
            User.find(function(err, users){
                if(err)
                    res.send(err);

                res.json(users);
            });
         //}
    });

router.route('/users/:user_id')
    //READ
    .get(function(req,res){
        //if(auth(req.body.username,req.body.password)){
            User.findById(req.params.user_id, function(err, user){
              if(err)
                  res.send(err);
              res.json(user);
            });
        //}
    })

    //UPDATE
    .put(function(req, res) {
        // use our user model to find the user we want
        User.findById(req.params.user_id, function(err, user) {
            if (err)
                res.send(err);

            if(typeof req.body.fname !== 'undefined')
                user.fname = req.body.fname;  // update the users info
            if(typeof req.body.name !== 'undefined')
                user.name = req.body.name;  // update the users info
            if(typeof req.body.email !== 'undefined')
                user.email = req.body.email;  // update the users info
            if(typeof req.body.pass !== 'undefined')
                user.pass = bcrypt.hashSync(req.body.pass,8);  // update the users info
            if(typeof req.body.avatar !== 'undefined')
                user.avatar = req.body.avatar;  // update the users info
            // save the user
            user.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ message: 'User updated' });
            });
        });
    })

    // delete the user with this id (accessed at DELETE http://localhost:8080/api/users/:user_id)
    .delete(function(req, res) {
        User.remove({
            _id: req.params.user_id
        }, function(err, user) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });



//Default .. ssh, don't talk
//router.get('/', function(req, res){
  //res.json({ message: 'o/' });
//});

//.post('/token', oauth2.controller.token);
app.post('/auth', isAuthorized, oauth2.controller.authorization);
app.get('/auth', isAuthorized, oauth2.controller.authorization, function(req, res){
  res.render('authorization', {layout: false});
});

app.use('/api', router);

app.listen(port);
console.log('Live on port: ' + port);


/** FUNCTIONS **/
function isAuthorized(req, res, next) {
      if (req.session.authorized) return next();
          res.redirect('/login?' + query.stringify({backUrl: req.url}));
}

function auth(username, password, res){
  if (username == user.name && bcrypt.compareSync(password, user.pass)){
    return true;
  }else{
    res.send(401);
  }
};

function sanitize(user_input) {
  if(user_input)
    return user_input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;');
}
