module.exports = {
    allGenres: "SELECT * FROM genre ;",
    oneGenre: "SELECT genreId, genre FROM genre WHERE genreId = ? ;",
    insertGenre: "INSERT INTO genre (genreId, genre) VALUES (0, ?) ;",
    deleteGenre: "DELETE FROM genre WHERE genreId = ? ;"
}