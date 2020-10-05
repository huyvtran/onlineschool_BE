const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    let authHeader = req.get('Authorization');
    if (!authHeader) {
        res.status(500).json({
            message: 'Authorization failed. can not get the token'
        });
    }
    const token = authHeader;
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'somesecretkey');
    } catch(error) {
        console.log(error);
    }

    if (!decodedToken) {
        res.status(401).json({
            message: 'Not Authenticated',
        })
    }

    console.log('decoded token', decodedToken);
    // req.mobilenumber = decodedToken.mobilenumber;
    next();
}