module.exports = {
    logginEmail: "SELECT userId, userPass FROM AppUser WHERE userEmail = ? ;",
    logginNick: "SELECT userId, userPass FROM AppUser WHERE logginNick = ? ;",
    logginIsMe: "SELECT *, '' AS pass FROM AppUser WHERE userId = ? ;",
    addUser: "INSERT INTO AppUser (userId, nick, pass, email, karma, userVisible) VALUES (0, ?, ?, ?, 0, 1)"
}