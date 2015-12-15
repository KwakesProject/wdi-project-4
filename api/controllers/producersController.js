var Producer    = require('../models/producer');

function producersIndex(req, res){
  Producer.find().populate('local.songs').exec(function(err, producers){
    if (err) return res.status(404).json({message: 'Something went wrong!!'});
    res.status(200).json({ producers: producers });
  })
}

function producersCreate(req, res){
  var producer  = new Producer(req.body)

  producer.save(function(err, producer){
    if (err) return res.status(500).json({ message: 'Something went wrong!!'});
    res.status(201).json({ message: 'A New Producer has been successfully created.', producer: producer})
  })
}

function producersShow(req, res){
  Producer.findById(req.params.id).populate('local.songs').exec(function(err, producer){
    if (err) return res.status(404).json({ message: 'Something went wrong!!'});
    res.status(200).json({ producer: producer});
  })
}

function producersUpdate(req, res){
  Producer.findById(req.params.id, function(err, producer){
    if (err) return res.status(500).json({ message: 'Something went wrong!!'});
    if (!producer) return res.status(404).json({ message: 'No Producer found???'});

    if (req.body.local.username) producer.local.username      = req.body.local.username;
    if (req.body.local.first_name) producer.local.first_name  = req.body.local.first_name;
    if (req.body.local.last_name) producer.local.last_name    = req.body.local.last_name;
    if (req.body.local.image) producer.local.image            = req.body.local.image;
    if (req.body.local.email) producer.local.email            = req.body.local.email;
    if (req.body.local.password) producer.local.password      = req.body.local.password;
    // if (req.body.local.song) producer.local.song              = req.body.local.song;
    if (req.body.local.contact.location) producer.local.contact.location = req.body.local.contact.location;
    if (req.body.local.contact.country) producer.local.contact.country = req.body.local.contact.country;

    producer.save(function(err){
      if (err) return res.status(500).json({ message: 'Something went wrong!!'});
      res.status(201).json({ message: 'Producer Profile Updated.', producer: producer})
    });    
  });
}

function producersDelete(req, res){
  Producer.findByIdAndRemove({_id: req.params.id}, function(err){
    if (err) return res.status(404).json({ message: 'Something went wrong!!'});
    res.status(200).json({ message: 'Producer has been successfully deleted'});
  });
}

module.exports = {
  producersIndex:   producersIndex,
  producersCreate:  producersCreate,
  producersShow:    producersShow,
  producersUpdate:  producersUpdate,
  producersDelete:  producersDelete
}