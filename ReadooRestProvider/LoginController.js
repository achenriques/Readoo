const mysql = require('mysql');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var userConfig = require('./Util/serverOptions');

class LoginProvider {
    
    constructor(app, db)
    {
      this.login(app, db); // Post
      this.isMe(app, db); //Get
      this.newUser(app, db); // Post
    }

    login(app, db) {
        app.post('/login', function(req, res) {
            if (req.body.email && req.body.pass) {

                var con = db.getConn(db.connect).then(function(response)
                {
                    var statement = "SELECT idUsuario, pass FROM usuario WHERE email = " + db.escape(req.body.email, true) + ";";
                    response.query(statement, function (err, result, fields) {
                        response.release();
                        if (err)
                        {
                            console.log(err);
                            res.status(204)        // HTTP status 204: NotContent
                            .send('Failed at consult');
                        } else {
                            console.log(result);
                            var userPass = result[0].pass;
                            var passwordIsValid = bcrypt.compareSync(req.body.pass, userPass);
                            
                            if (!passwordIsValid)
                                return res.status(401).send({ auth: false, token: null });
                            
                            var token = jwt.sign(
                                { id: result[0].idUsuario }, 
                                userConfig.users.readooUser, 
                                { expiresIn: 86400} // expires in 24 hours 
                            );
                            res.status(200).send({ auth: true, token: token });
                        }
                    });
                }, function (error)
                {
                    console.log(error);
                    res.status(500)        // HTTP status 500: InternalErrorNotDbConnection
                        .send('Not DB connection');
                });
            }
      });
    }

    isMe(app, db)
    {
      app.get('/login/isme', function (req, res) 
      {
        var token = req.headers['x-access-token'];
        if (!token) 
            return res.status(401).send({ auth: false, message: 'No token provided.' });
        
        jwt.verify(token, userConfig.users.readooUser, function(err, decoded) {
            if (err) 
                return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
          
            var con = db.getConn(db.connect).then(function(response)
            {
                var statement = "SELECT *, '' AS pass FROM usuario WHERE idUsuario = " + db.escape(decoded.id) + ";";
                response.query(statement, function (err, result, fields) {
                    response.release();
                    if (err)
                    {
                        console.log(err);
                        res.status(204)        // HTTP status 204: NotContent
                        .send('Failed at consult');
                    } else {
                        res.setHeader('Content-Type', 'application/json');
                        res.status(200).json(result);
                    }
                });
            }, function (error)
            {
                console.log(error);
                res.status(500)        // HTTP status 500: InternalErrorNotDbConnection
                    .send('Not DB connection');
            });
        });
      });
    }
  
    newUser(app, db)
    {
      app.post('/login/new', function (req, res) {
          console.log("Estoy insertando " + req.body.apodo);     
          if (req.body.apodo && req.body.pass && req.body.email)
          {
              var hashedPassword = bcrypt.hashSync(req.body.pass, 8);
      
              var con = db.getConn(db.connect).then(function(response)
              {
                var statement = "INSERT INTO usuario (idUsuario, apodo, pass, email, karma, visible) VALUES (" + 0 + ", " 
                + db.escape(req.body.apodo) + ", '" + hashedPassword + "', " + db.escape(req.body.email) + ", 0, 'S');";
        
                console.log(statement);

                response.query(statement, function (err, result) {
                response.release();
                if (err)
                {
                    if (err.code == 'ER_DUP_ENTRY')
                    {   
                        console.log(err);
                        res.status(206)        // HTTP status 206: Duplicated entry
                            .send('Duplicated Entry');
                    } else
                    {
                        console.log(err);
                        res.status(204)        // HTTP status 204: NotContent
                        .send('Failed at consult');
                    }
                } else {

                    // create a token
                    var token = jwt.sign(
                        { id: result.insertId }, 
                        userConfig.users.readooUser, {
                        expiresIn: 86400 // expires in 24 hours
                    });
                    res.status(200).send({ auth: true, token: token });
                }
              });
              }, function (error)
              {
                  console.log(error);
                  res.status(500)        // HTTP status 500: InternalErrorNotDbConnection
                    .send('Not DB connection');
              });
          }
     });
    }
    
    // Funcion como middleware
    verifyToken(req, res, next) {
        var token = req.headers['x-access-token'];
        if (!token)
          return res.status(403).send({ auth: false, message: 'No token provided.' });
        jwt.verify(token, userConfig.users.readooUser, function(err, decoded) {
          if (err)
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
          // if everything good, save to request for use in other routes
          req.userId = decoded.id;
          next();
        });
    }
}
  
module.exports = LoginProvider;
  