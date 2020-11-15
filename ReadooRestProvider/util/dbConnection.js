const mysql = require('mysql');

// Env vars
const bdhost = process.env.DB_HOST;
const bdUser = process.env.DB_USER;
const bdPass = process.env.DB_PASS;

class Connection
{
  constructor()
  {
    this.connect = mysql.createPool({
      //properties
      host:'localhost',
      user: bdUser,
      password: bdPass,
      database: 'readoo_db',
      connectionLimit: 50
    });
    console.info("Building DB connection pool");
  }

  getConn(connect)
  {
    return new Promise(function (response, reject)
    {
      connect.getConnection(function(error, tempCon)
      {
        if(error)
        {
          console.log(error);
          reject(error);
        } else
        {
          response(tempCon);
        }
      });
    });
  }
}

module.exports = Connection;
