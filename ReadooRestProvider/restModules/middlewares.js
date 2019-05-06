module.exports = {
    checkToken : function (req, res, next) {
        let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
        if (token.startsWith('Bearer ')) {
          // Remove Bearer from string
          token = token.slice(7, token.length);
        }
      
        if (token) {
          jwt.verify(token, readooUserPass, (err, decoded) => {
            if (err) {
              return res.json({
                success: false,
                message: 'Token is not valid!'
              });
            } else {
              req.decoded = decoded;
              next();
            }
          });
        } else {
          return res.json({
            success: false,
            message: 'Auth token is not supplied!'
          });
        }
    },

    verifyToken : function (req, res, next) {
        let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
        if (!token) {
            return res.status(403).send({ auth: false, message: 'No token provided.' });
        }
        // No util info
        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
        }
      
        jwt.verify(token, readooUserPass, function(err, decoded) {
            if (err) {
                return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
            }
            // if everything good, save to request for use in other routes
            req.userId = decoded.id;
            next();
        });
    }
}