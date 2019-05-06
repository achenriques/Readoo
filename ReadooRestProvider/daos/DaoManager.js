const constants = require('../util/constants');

class DaoManager {
    
    db = null;

    constructor(db) {
        this.db = db;
    }

    // this function manages a select into the DB: resultHandeler must be a function
    executeStatment(stringQuery, params, resultHandler) {
        this.db.getConn(this.db.connect).then(function(response) {
            response.query(stringQuery, params, function (err, result, fields) {
                response.release();
                if (err) {
                    if (err.code == 'ER_DUP_ENTRY') {
                        console.log('Duplicated Entry!'); 
                        console.log(err);
                        return constants.queryErrorDuplicateEntry;
                    } else {
                        console.log('Query Error!');
                        console.log(err);
                        return constants.queryError;
                    }
                } else {
                    if (resultHandler && typeof resultHandler === 'function') {
                        return resultHandler(result);
                    }
                    return result;
                }
            });
        }, function (error) {
            console.log(error);
            return constants.dbConnectionFail;
        });
    }

}

module.exports = DaoManager;