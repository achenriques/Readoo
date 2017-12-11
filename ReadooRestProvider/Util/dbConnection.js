const mysql = require('mysql');

class Connection
{
  constructor()
  {
    this.connect = mysql.createPool({
      //properties
      host:'localhost',
      user: 'root',
      password: '1234',
      database: 'readoo_db',
      connectionLimit: 50
    });
    console.log("Building DB connection pool");
  }

  getConn(connect)
  {
    return new Promise(function (response, reject)
    {
      connect.getConnection(function(error, tempCon)
      {
        if(error)
        {
          console.log('Error in the query');
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
