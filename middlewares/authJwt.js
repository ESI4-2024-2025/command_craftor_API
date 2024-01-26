const jwt = require("jsonwebtoken");

const accessTokenSecret = process.env.TOKEN_SECRET
const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
    if (err instanceof TokenExpiredError) {
        return res
            .status(401)
            .send({ message: "Unauthorized! Access Token was expired!" });
    }
    return res.sendStatus(401).send({ message: "Unauthorized!" });
};

const verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"] ?? '';
    if (!token || token === '') {
        return res.status(403).send({ message: "No token provided!" });
    }
    jwt.verify(token, accessTokenSecret, (err, decoded) => {
        if (err) {
            console.log(err)
            return catchError(err, res);
        }
        req.userId = decoded.id;
        next();
    });
};

const identifyUser = tokenHeader => {
    return new Promise((resolve, reject) => {
        let token = tokenHeader ?? '';
        if (!token || token === '') {
            return reject("No token provided!")
        }

        jwt.verify(token, accessTokenSecret, (err, decoded) => {
            if (err) {
                console.log(err)
                return reject(err);
            }
            resolve(decoded)
        });
    })
};

const authJwt = {
    verifyToken,
    identifyUser
};
module.exports = authJwt;