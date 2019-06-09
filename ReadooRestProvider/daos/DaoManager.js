const constants = require('../util/constants');
/*
 * Class DaoManager is the father class of all Daos.
 * This class execute all the calls to the DATABASE.
 * Because all of the calls are simmilar using the MySQL for node,
 *  this class just execute the queries with the parameters from the Providers
*/
class DaoManager {
    
    constructor(db) {
        this.db = db;
    }

    // this function manages a operation on the DB: resultHandeler must be a function
    executeStatment(stringQuery, params, resultHandler) {
        let that = this;
        return new Promise(function(resolve, reject) {
            that.db.getConn(that.db.connect).then(function(response) {
                response.query(stringQuery, params, function (err, result, fields) {
                    response.release();
                    if (err) {
                        if (err.code == 'ER_DUP_ENTRY') {
                            console.log('Duplicated Entry!'); 
                            console.log(err);
                            reject(constants.queryErrorDuplicateEntry);
                        } else {
                            console.log('Query Error!');
                            console.log(err);
                            reject(constants.queryError);
                        }
                    } else {
                        if (resultHandler && typeof resultHandler === 'function') {
                            resolve(resultHandler(result));
                        } else {
                            resolve(result);
                        }
                    }
                });
            }, function (error) {
                console.log(error);
                reject(constants.dbConnectionFail);
            });
        });
    }

    // A list of operations is called in the same transaction
    // You shoul pass a list of list with the arguments of the funciont this.executeStatment
    // Return -> a list of results of the transactions, ordered by arguments positions in the gived list
    executeStatmentOnSameTransaction(executeStatmentFunctionsParametersLists) {
        var toRet = [];
        let that = this;
        return new Promise(function(resolve, reject) {
            that.db.getConn(that.db.connect).beginTransaction(function(err) {
                if (err) {
                    console.log('Create Transaction Error!');
                    console.log(err);
                    return constants.queryError;
                } else {
                    for (let f of  executeStatmentFunctionsParametersLists) {
                        let result = that.executeStatment.apply(that, executeStatmentFunctionsParametersLists).then(
                            function (res) {
                                toRet.push(res);
                            }
                        ).catch(
                            function (err) {
                                return err;
                            }
                        );
                    }
                    return toRet;
                }
            });
        });
    }
}

module.exports = DaoManager;