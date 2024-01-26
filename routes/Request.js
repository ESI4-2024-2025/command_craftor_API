// Require controller modules.
const Request = require('../controllers/requestControllers')

const { authJwt } = require("../middlewares");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-token-acces, Origin, Content-Type, Accept"
        );
        next();
    });

    //Get
    app.get('/getRequest', [authJwt.verifyToken], Request.getRequest)
    //Post
    app.post('/addRequest', [authJwt.verifyToken], Request.addRequest)
    //Put
    app.put('/updateRequest', [authJwt.verifyToken], Request.updateRequest)
    //Delete
    app.delete('/deleteRequest', [authJwt.verifyToken], Request.deleteRequest)
}