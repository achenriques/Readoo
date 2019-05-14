const queries = require('../queries/genreQueries');
const DaoManager = require('./DaoManager');

class GenreDao extends DaoManager{
    
    constructor(db) {
        super(db);
    }

    getAllGenre() {
        let statement = queries.allGenres;
        return this.executeStatment(statement);
    }

    getOneGenre(genreId) {
        let statement = queries.oneGenre;
        return this.executeStatment(statement, [genreId]);
    }

    addGenre(genreText) {
        let statement = queries.insertGenre;
        return this.executeStatment(statement, [genreText])
    }

    deleteGenre(genreId) {
        let statement = queries.deleteGenre;
        return this.executeStatment(statement, [genreId]);
    }        
}

module.exports = GenreDao;
