var express = require("express");
var router = express.Router();
var path = require("path");
var pg = require("pg");
var randomNum = require("./randomNum.js");

router.get('/skolko', function(req, res){
    res.send(randomNum(1,100));
});


if (process.env.DATABASE_URL) {
  pg.defaults.ssl = true;
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = 'postgres://localhost:5432/zooData';
}

pg.connect(connectionString, function(err, client, done){
  if (err) {
    console.log('Error connecting to DB!', err);
  } else {
    var query = client.query('CREATE TABLE IF NOT EXISTS animals (' +
    'id SERIAL PRIMARY KEY,' +
    'animal_type varchar(80) NOT NULL,' +
    'skolko text NOT NULL);'
  );

  query.on('end', function(){
    console.log('Successfully ensured schema exists');
    done();
  });

  query.on('error', function() {
    console.log('Error creating schema!');
    done();
  });
}
});

router.post('/animals', function(req, res) {
  console.log('body: ', req.body);
  var animal_type = req.body.animal_type;
  var skolko = req.body.skolko;

  // connect to DB
  pg.connect(connectionString, function(err, client, done){
    if (err) {
      done();
      console.log('Error connecting to DB: ', err);
      res.status(500).send(err);
    } else {
      var result = [];

      var query = client.query('INSERT INTO animals (animal_type, skolko) VALUES ($1, $2) ' +
      'RETURNING id, animal_type, skolko', [animal_type, skolko]);

      query.on('row', function(row){
        result.push(row);
      });

      query.on('end', function() {
        done();
        res.send(result);
      });

      query.on('error', function(error) {
        console.log('Error running query:', error);
        done();
        res.status(500).send(error);
      });
    }
  });
});

router.get('/animals', function(req, res){

  pg.connect(connectionString, function(err, client, done){
    if (err) {
      done();
      console.log('Error connecting to DB: ', err);
      res.status(500).send(err);
    } else {
      var result = [];
      var query = client.query('SELECT * FROM animals;');

      query.on('row', function(row){
        result.push(row);
      });

      query.on('end', function() {
        done();
        res.send(result);
      });

      query.on('error', function(error) {
        console.log('Error running query:', error);
        done();
        res.status(500).send(error);
      });
    }
  });
});

router.get('/*', function(req, res){
  var filename = req.params[0] || 'views/index.html';
  res.sendFile(path.join(__dirname, '../public/', filename));
});




router.get('/*', function(req, res){
  var filename = req.params[0] || 'views/index.html';
  res.sendFile(path.join(__dirname, '../public/', filename));
});

module.exports = router;
