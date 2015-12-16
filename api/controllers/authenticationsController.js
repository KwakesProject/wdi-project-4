var passport = require("passport");
var Producer = require('../models/producer');
var secret   = require('../config/config').secret; 
var jwt      = require('jsonwebtoken');

function register(req, res, next) {
  var localStrategy = passport.authenticate('local-signup', function(err, producer, info) {
    if (err) return res.status(500).json({ message: 'Something went wrong!' });
    if (info) return res.status(401).json({ message: info.message });
    if (!producer) return res.status(401).json({ message: 'Producer already exists!' });

    var token = jwt.sign(producer, secret, { expiresIn: 60*60*24 });
    return res.status(200).json({ 
      success: true,
      message: "Thank you for authenticating",
      token: token,
      producer: producer
    });
  });
  return localStrategy(req, res, next);
};

function login(req, res, next) {
  Producer.findOne({
    "local.email": req.body.email
  }, function(err, producer) {
    if (err) return res.status(500).json(err);
    if (!producer) return res.status(403).json({ message: 'No producer found.' });
    if (!producer.validPassword(req.body.password)) return res.status(403).json({ message: 'Authentication failed.' });

    var token = jwt.sign(producer, secret, { expiresIn: 60*60*24 });

    return res.status(200).json({
      success: true,
      message: 'Welcome!',
      token: token,
      producer: producer
    });
  });
};

module.exports = {
  login: login,
  register: register
}