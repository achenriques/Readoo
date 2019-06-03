const middleware = require('./middlewares');
const UserDao = require('../daos/UserDao');

class UserProvider {
    
    constructor(app, db)
    {
        this.userDao = new UserDao(db);
        this.getAll(app);           //Get
        this.getOne(app);           //Get
        this.modifyOne(app);        //Put
        this.deleteOne(app);        //Delete
        this.insertOne(app);        // Post
    }
    
      getAll(app) {
        app.get('/user', function (req, res) {
            let users = this.userDao.getAllUsers();
            if (Number.isNaN(users)) {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(users));
                //res.json(users);
            } else {
                // Sql Err
                let reqError = functions.getRequestError(users);
                res.status(reqError.code)
                    .send(reqError.text);
            }
        });
    }

    getOne(app) {
        app.get('/user/:id', middleware.verifyToken, function (req, res) 
        {
            let userId = req.params.id;
            console.log("Estoy getteando " + userId);
            if (userId) {
                let userData = this.userDao.getOneUser(+userId);
                if (Number.isNaN(userData)) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(userData));
                    //res.json(userData);
                } else {
                    // Sql Err
                    let reqError = functions.getRequestError(userData);
                    res.status(reqError.code)
                        .send(reqError.text);
                }
            } else {
                res.status(400)        // HTTP status 400: BadRequest
                    .send('Missed Id');
            }
        });
    }

    modifyOne(app) {
        app.put('/user', middleware.verifyToken, function (req, res) {
            let userToUpdate = req.body.user;
            console.log("Estoy modificando " + userToUpdate);     
            if (userToUpdate && userToUpdate.userName && userToUpdate.userSurname && userToUpdate.userNick && userToUpdate.userPass && userToUpdate.userEmail && 
                    userToUpdate.userAboutMe && userToUpdate.userAvatarUrl && userToUpdate.userId) {
                let hashedPassword = bcrypt.hashSync(userToUpdate.userPass, 8);
                let updatedInfo = this.userDao.updateOneUser(userToUpdate.userName.trim(), userToUpdate.userSurname.trim(), userToUpdate.userNick.trim(), hashedPassword, userToUpdate.userEmail.trim(), 
                    userToUpdate.userAboutMe.trim(), userToUpdate.userAvatarUrl, +userToUpdate.userId);

                if (Number.isInteger(updatedInfo) && updatedInfo > 0) {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json(updatedInfo);
                } else {
                    let reqError = functions.getRequestError(updatedInfo);
                    res.status(reqError.code)        
                        .send(reqError.text);
                }
            } else {
                res.status(400)        // HTTP status 400: BadRequest
                    .send('Missed Id');
            }
        });
    }
    
    insertOne(app) {
        app.post('/user', middleware.verifyToken, function (req, res) {
            let userToInsert = req.body.user;
            console.log("Estoy insertando " + userToInsert);     
            if (userToInsert && userToInsert.userName && userToInsert.userSurname && userToInsert.userNick && userToInsert.userPass && userToInsert.userEmail && 
                userToInsert.userAboutMe && userToInsert.userAvatarUrl) {
                let newUserId = this.userDao.insertOne(userToInsert.userName.trim(), userToInsert.userSurname.trim(), userToInsert.userNick.trim(), userToInsert.userPass, userToInsert.userEmail.trim(), 
                    userToInsert.userAboutMe.trim(), userToInsert.userAvatarUrl);

                if (Number.isInteger(newUserId) && newUserId > 0) {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json(newUserId);
                } else {
                    let reqError = functions.getRequestError(newUserId);
                    res.status(reqError.code)        
                        .send(reqError.text);
                }
            } else {
                res.status(400)        // HTTP status 400: BadRequest
                    .send('Missed Id');
            }
        });
    }
    
    dissableOne(app) {
        app.post('/dissableUser', middleware.verifyToken, function (req, res) {
        console.log("Estoy deshabilitando usuario");

        let userId = req.body.userId;
        if (userId) {
            let oldUserId = this.userDao.dissableOneUser(+userId);
            if (Number.isInteger(oldUserId) && oldUserId > 0) {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json(oldUserId);
            } else {
                let reqError = functions.getRequestError(oldUserId);
                res.status(reqError.code) 
                    .send(reqError.text);
                }
            } else {
                res.status(400)
                    .send('Missed Id');
            }
        });
    }

    deleteOne(app) {
        app.delete('/user', function (req, res) {
            console.log("Estoy deleteando " + req.body.id);
            let userId = req.body.id;
            if (userId) {
                let oldUserId = this.userDao.deleteOneUser(+userId);
                if (Number.isInteger(oldUserId) && oldUserId > 0) {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json(oldUserId);
                } else {
                    let reqError = functions.getRequestError(oldUserId);
                    res.status(reqError.code)
                        .send(reqError.text);
                }
            } else {
                res.status(400)        // HTTP status 400: BadRequest
                    .send('Missed Id');
            }
        });
    };
    
}
    
module.exports = UserProvider;
    