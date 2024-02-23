// Require controller modules.
const Request = require('../controllers/requestControllers')
const { body, validationResult, check } = require('express-validator');
const requestModel = require('../models/requestModel');
const { authJwt } = require("../middlewares");
const express = require('express'); // Import the express module

module.exports = function (app) {

    //Get
    app.get('/getRequest', Request.getRequest)
    //Post
    app.post('/ARequest', Request.Request)

}