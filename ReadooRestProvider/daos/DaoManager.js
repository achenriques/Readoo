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
            that.db.getConn(that.db.connect).then(function(connection) {
                connection.query(stringQuery, params, function (err, result, fields) {
                    connection.release();
                    if (err) {
                        if (err.code == 'ER_DUP_ENTRY') {
                            console.log('Duplicated Entry!'); 
                            console.error(err);
                            reject(constants.QUERY_ERROR_DUPLICATE_ENTRY);
                        } else {
                            console.log('Query Error!');
                            console.error(err);
                            reject(constants.QUERY_ERROR);
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
                console.error(error);
                reject(constants.DB_CONNECTION_FAIL);
            }).catch (
                function (que) {
                    console.error(error);
                    reject(constants.DB_CONNECTION_FAIL);
                }
            );
        });
    }

    // A list of operations is called in the same transaction
    // You shoul pass a list of list with the arguments of the funciont this.executeStatment
    // Return -> a list of results of the transactions, ordered by arguments positions in the gived list
    executeStatmentOnSameTransaction(executeStatmentFunctionsParametersLists) {
        var toRet = [];
        let that = this;
        return new Promise(function(resolve, reject) {
            that.db.getConn(that.db.connect).then(
                function(connection) {
                    connection.beginTransaction(function(err) {
                        if (err) {
                            connection.rollback(function() {
                                connection.release();
                                //Failure
                            });
                            console.log('Create Transaction Error!');
                            console.error(err);
                            reject(constants.QUERY_ERROR);
                        } else {
                            for (let f of  executeStatmentFunctionsParametersLists) {
                                let result = that.executeStatment.apply(that, f).then(
                                    function (res) {
                                        toRet.push(res);
                                        if (toRet.length === executeStatmentFunctionsParametersLists.length) {
                                            resolve(toRet);
                                        }
                                    }
                                ).catch(
                                    function (err) {
                                        connection.rollback(function() {
                                            connection.release();
                                            //Failure
                                        });
                                        reject(err);
                                    }
                                );
                            }
                        }
                    });
                }, function (error) {
                    console.error(error);
                    reject(constants.DB_CONNECTION_FAIL);
                }
            ).catch (
                function (err) {
                    console.error(err);
                    reject(constants.DB_CONNECTION_FAIL);
                }
            );
        });
    }
}

module.exports = DaoManager;