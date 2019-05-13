const express = require('express');
const app = express();

const router = express.Router();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use(bodyParser.json());

/* var basicAuth = require('express-basic-auth')
var serverCredentials = require('./Util/serverOptions');
app.use(basicAuth(serverCredentials)); */

let allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', '*');

  next();
}
app.use(allowCrossDomain);

const middleware = require('./restModules/middlewares');

const Connection = require('./Util/dbConnection');
const db = new Connection();

const LoginProvider = require('./restModules/LoginProvider');
new LoginProvider(app, db, middleware);

const BookProvider = require('./restModules/BookProvider')
new BookProvider(app, db, middleware);

const UserProvider = require('./restModules/UserProvider');
new UserProvider(app, db, middleware);

const GenreProvider = require('./restModules/GenreProvider');
new GenreProvider(app, db, middleware);

const UserGenreProvider = require('./restModules/UserGenreProvider');
new UserGenreProvider(app, db, middleware);

const LastBookProvider = require('./restModules/LastBookProvider');
new LastBookProvider(app, db, middleware);

const UserLikesBookProvider = require('./restModules/UserLikesBookProvider');
new UserLikesBookProvider(app, db, middleware);

const CommentProvider = require('./restModules/CommentProvider');
new CommentProvider(app, db, middleware);

const UserReportsCommentProvider = require('./restModules/UserReportsCommentProvider');
new UserReportsCommentProvider(app, db, middleware);

const UserReportsBookProvider = require('./restModules/UserReportsBookProvider');
new UserReportsBookProvider(app, db, middleware);

app.listen(3030, function () {
  console.log('App is listening on port 3030!');
});
