// Read .env file
const dotenv = require('dotenv').config();
if (dotenv.error) {
     console.error("Something goes wrong at reading .env file: " + dotenv.error);
}
// Express
const http = require("http");
const express = require('express');
const app = express();
// Cors
const cors = require('cors');
// const router = express.Router();
const bodyParser = require('body-parser');
// Url encoder for photos and other data
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use(bodyParser.json());
// Path
const path = require('path');

/* var basicAuth = require('express-basic-auth')
var serverCredentials = require('./Util/serverOptions');
app.use(basicAuth(serverCredentials)); */

const whitelist = require('./util/corsWhitelist');

// Using cors
app.use(cors({
     origin: (origin, cb) => {
          if (!origin || whitelist.indexOf(origin) !== -1) {
               return cb(null, true);
          }
          return cb(new Error("Cors error"), false);
     },
     credentials: true,
     allowedHeaders: 'Content-Type,x-access-token,Authorization'
}));

// Create a http server...
const server = http.createServer(app);

// Create a dbConnection
const Connection = require('./Util/dbConnection');
const db = new Connection();

app.use(express.static(path.join(__dirname, '../ReadooClient/build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../ReadooClient/build', '../ReadooClient/build/index.html'));
});

// Crating rest services
const LoginProvider = require('./restModules/LoginProvider');
new LoginProvider(app, db);

const BookProvider = require('./restModules/BookProvider')
new BookProvider(app, db);

const UserProvider = require('./restModules/UserProvider');
new UserProvider(app, db);

const GenreProvider = require('./restModules/GenreProvider');
new GenreProvider(app, db);

const UserGenreProvider = require('./restModules/UserGenreProvider');
new UserGenreProvider(app, db);

const LastBookProvider = require('./restModules/LastBookProvider');
new LastBookProvider(app, db);

const UserLikesBookProvider = require('./restModules/UserLikesBookProvider');
new UserLikesBookProvider(app, db);

const CommentProvider = require('./restModules/CommentProvider');
new CommentProvider(app, db);

const ChatProvider = require('./restModules/ChatProvider');
new ChatProvider(app, server, db);

const UserReportsCommentaryProvider = require('./restModules/UserReportsCommentaryProvider');
new UserReportsCommentaryProvider(app, db);

const UserReportsBookProvider = require('./restModules/UserReportsBookProvider');
new UserReportsBookProvider(app, db);

// All services are now listening in the port 3030
server.listen(process.env.PORT || 3030, function () {
  console.info('App is listening on port: ' + process.env.PORT || 3030 + "!");
});