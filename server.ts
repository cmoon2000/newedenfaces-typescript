// Babel ES6/JSX Compiler
require('babel-register');

import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';

import * as swig from 'swig';
import * as React from 'react';
import * as ReactDOM from 'react-dom/server';
import * as Router from 'react-router';
import * as _ from 'underscore';
import * as mongoose from 'mongoose';
import * as logger from 'morgan';
import * as async from 'async';
import * as request from 'request';
import * as xml2js from 'xml2js';

import Character, { ICharacterModel } from  './models/character';

import routes from './app/routes';


const config: { database: string } = require('./config');

const app = express();

mongoose.connect(config.database);
mongoose.connection.on('error', function() {
	  console.info('Error: Could not connect to MongoDB. Did you forget to run `mongod`?');
});

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

/**
 * POST /api/characters
 * Adds new character to the database.
 */
app.post('/api/characters', function(req, res, next) {
  let gender = req.body.gender;
  let characterName = req.body.name;
  let characterIdLookupUrl = 'https://api.eveonline.com/eve/CharacterID.xml.aspx?names=' + characterName;

  let parser = new xml2js.Parser();

  async.waterfall([
    function(callback: Function) {
      request.get(characterIdLookupUrl, function(err, _request, xml) {
        if (err) return next(err);
        parser.parseString(xml, function(err: any, parsedXml: any) {
          if (err) return next(err);
          try {
            const characterId: string = parsedXml.eveapi.result[0].rowset[0].row[0].$.characterID;

            Character.findOne({ characterId: characterId }, function(err, character) {
              if (err) return next(err);

              if (character) {
                return res.status(409).send({ message: character.name + ' is already in the database.' });
              }

              callback(err, characterId);
            });
          } catch (e) {
            return res.status(400).send({ message: 'XML Parse Error' });
          }
        });
      });
    },
    function(characterId: string) {
			var characterInfoUrl = 'https://api.eveonline.com/eve/CharacterInfo.xml.aspx?characterID=' + characterId;

			request.get({ url: characterInfoUrl }, function(err, _request, xml) {
				if (err) return next(err);
				parser.parseString(xml, function(err: any, parsedXml: any): any {
					if (err) return res.send(err);
					try {
						var name = parsedXml.eveapi.result[0].characterName[0];
						var race = parsedXml.eveapi.result[0].race[0];
						var bloodline = parsedXml.eveapi.result[0].bloodline[0];

						var character = new Character({
							characterId: characterId,
							name: name,
							race: race,
							bloodline: bloodline,
							gender: gender,
							random: [Math.random(), 0]
						});

						character.save(function(err) {
							if (err) return next(err);
							res.send({ message: characterName + ' has been added successfully!' });
						});
					} catch (e) {
						res.status(404).send({ message: characterName + ' is not a registered citizen of New Eden.' });
					}
				});
			});
		}
  ]);
});

/**
 * GET /api/characters
 * Returns 2 random characters of the same gender that have not been voted yet.
 */
app.get('/api/characters', function(_req, res, next) {
  const choices = ['Female', 'Male'];
  const randomGender = _.sample(choices);

  Character.find({ random: { $near: [Math.random(), 0] } })
    .where('voted', false)
    .where('gender', randomGender)
    .limit(2)
    .exec(function(err, characters) {
      if (err) return next(err);

      if (characters.length === 2) {
        return res.send(characters);
      }

      const oppositeGender = _.first(_.without(choices, randomGender));

      Character
        .find({ random: { $near: [Math.random(), 0] } })
        .where('voted', false)
        .where('gender', oppositeGender)
        .limit(2)
        .exec(function(err, characters) {
          if (err) return next(err);

          if (characters.length === 2) {
            return res.send(characters);
          }

          Character.update({}, { $set: { voted: false } }, { multi: true }, function(err) {
            if (err) return next(err);
            res.send([]);
          });
        });
    });
});

/**
 * PUT /api/characters
 * Update winning and losing count for both characters.
 */
app.put('/api/characters', function(req, res, next): any {
  const winner: string = req. body.winner;
  const loser: string = req.body.loser;

  if (!winner || !loser) {
    return res.status(400).send({ message: 'Voting requires two characters.' });
  }

  if (winner === loser) {
    return res.status(400).send({ message: 'Cannot Vote for and against the same character.' });
  }

  async.parallel([
    function(callback) {
      Character.findOne({ characterId: winner }, function(err, winner) {
        callback(err, winner);
      });
    },
    function(callback) {
      Character.findOne({ characterId: loser }, function(err, loser) {
        callback(err, loser);
      });
    }
  ],
  function(err, results: Array<ICharacterModel>) {
    if (err) return next(err);

    const winner = results[0];
    const loser = results[1];

    if (!winner || !loser) {
      return res.status(404).send({ message: 'One of the characters no longer exists.' });
    }

    if (winner.voted || loser.voted) {
      return res.status(200).end();
    }

    async.parallel([
      function(callback) {
        winner.wins++;
        winner.voted = true;
        winner.random = [Math.random(), 0];
        winner.save(function(err) {
          callback(err);
        });
      },
      function(callback) {
        loser.losses++;
        loser.voted = true;
        loser.random = [Math.random(), 0];
        loser.save(function(err) {
          callback(err);
        });
      }
    ], function(err) {
      if (err) return next(err);
      res.status(200).end();
    });
  });
});

/**
 * GET /api/characters/count
 * Returns the total number of characters.
 */
app.get('/api/characters/count', function(_req, res, next) {
  Character.count({}, function(err, count) {
    if (err) return next(err);
    res.send({ count: count });
  });
});

/**
 * GET /api/characters/search
 * Looks up a character by name. (case-insensitive)
 */
app.get('/api/characters/search', function(req, res, next) {
  const characterName = new RegExp(req.query.name, 'i');

  Character.findOne({ name: characterName }, function(err, character) {
    if (err) return next(err);

    if (!character) {
      return res.status(404).send({ message: 'Character not found.' });
    }

    res.send(character);
  });
});

/**
 * GET /api/characters/top
 * Return 100 highest ranked characters. Filter by gender, race and bloodline.
 */
app.get('/api/characters/top', function(req, res, next) {
  const params = req.query;
  const conditions: any = {};

  _.each(params, function(value, key) {
    conditions[key] = new RegExp('^' + value + '$', 'i');
  });

  Character
    .find(conditions)
    .sort('-wins') // Sort in descending order (highest wins on top)
    .limit(100)
    .exec(function(err, characters) {
      if (err) return next(err);

      // Sort by winning percentage
      characters.sort(function(a: ICharacterModel, b: ICharacterModel) {
        if (a.wins / (a.wins + a.losses) < b.wins / (b.wins + b.losses)) { return 1; }
        if (a.wins / (a.wins + a.losses) > b.wins / (b.wins + b.losses)) { return -1; }
        return 0;
      });

      res.send(characters);
    });
});

/**
 * GET /api/characters/shame
 * Returns 100 lowest ranked characters.
 */
app.get('/api/characters/shame', function(_req, res, next) {
  Character
    .find()
    .sort('-losses')
    .limit(100)
    .exec(function(err, characters) {
      if (err) return next(err);
      res.send(characters);
    });
});

/**
 * GET /api/characters/:id
 * Returns detailed character information
 */
app.get('/api/characters/:id', function(req, res, next) {
  const id: string = req.params.id;

  Character.findOne({ characterId: id }, function(err, character) {
    if (err) return next(err);

    if (!character) {
      return res.status(404).send({ message: 'Character not found.' });
    }

    res.send(character);
  });
});

/**
 * POST /api/report
 * Reports a character. Character is removed after 4 reports.
 */
app.post('/api/report', function(req, res, next) {
  const characterId: string = req.body.characterId;

  Character.findOne({ characterId: characterId }, function(err, character) {
    if (err) return next(err);

    if (!character) {
      return res.status(404).send({ message: 'Character not found.' });
    }

    character.reports++;

    if (character.reports > 4) {
      character.remove();
      return res.send({ message: character.name + ' has been deleted.' });
    }

    character.save(function(err) {
      if (err) return next(err);
      res.send({ message: character.name + ' has been reported.' });
    });
  });
});

/**
 * GET /api/stats
 * Returns characters statistics.
 */
app.get('/api/stats', function(_req, res, next) {
  async.parallel([
    function(callback) {
      Character.count({}, function(err, count) {
        callback(err, count);
      });
    },
    function(callback) {
      Character.count({ race: 'Amarr' }, function(err, amarrCount) {
        callback(err, amarrCount);
      });
    },
    function(callback) {
      Character.count({ race: 'Caldari' }, function(err, caldariCount) {
        callback(err, caldariCount);
      });
    },
    function(callback) {
      Character.count({ race: 'Gallente' }, function(err, gallenteCount) {
        callback(err, gallenteCount);
      });
    },
    function(callback) {
      Character.count({ race: 'Minmatar' }, function(err, minmatarCount) {
        callback(err, minmatarCount);
      });
    },
    function(callback) {
      Character.count({ gender: 'Male' }, function(err, maleCount) {
        callback(err, maleCount);
      });
    },
    function(callback) {
      Character.count({ gender: 'Female' }, function(err, femaleCount) {
        callback(err, femaleCount);
      });
    },
    function(callback) {
      Character.aggregate({ $group: { _id: null, total: { $sum: '$wins' } } }, function(err: any, totalVotes: any) {
        const total = totalVotes.length ? totalVotes[0].total : 0;
        callback(err, total);
      });
    },
    function(callback) {
      Character
        .find()
        .sort('-wins')
        .limit(100)
        .select('race')
        .exec(function(err, characters) {
          if (err) return next(err);

          const raceCount = _.countBy(characters, function(character) { return character.race; });
          const max = _.max(raceCount, function(race) { return race; });
          const inverted = _.invert(raceCount);
          const topRace = inverted[max];
          const topCount = raceCount[topRace];

          callback(err, { race: topRace, count: topCount });
        });
    },
    function(callback) {
      Character
        .find()
        .sort('-wins')
        .limit(100)
        .select('bloodline')
        .exec(function(err, characters) {
          if (err) return next(err);

          const bloodlineCount = _.countBy(characters, function(character) { return character.bloodline; });
          const max = _.max(bloodlineCount, function(bloodline) { return bloodline });
          const inverted = _.invert(bloodlineCount);
          const topBloodline = inverted[max];
          const topCount = bloodlineCount[topBloodline];

          callback(err, { bloodline: topBloodline, count: topCount });
        });
    }
  ],
  function(err, results) {
    if (err) return next(err);

    res.send({
      totalCount: results[0],
      amarrCount: results[1],
      caldariCount: results[2],
      gallenteCount: results[3],
      minmatarCount: results[4],
      maleCount: results[5],
      femaleCount: results[6],
      totalVotes: results[7],
      leadingRace: results[8],
      leadingBloodline: results[9],
    });
  });
});

app.use(function(req, res) {
  Router.match({ routes: routes, location: req.url },
    function(err, redirectLocation, renderProps) {
      if (err) {
        res.status(500).send(err.message);
      } else if (redirectLocation) {
        res.status(302).redirect(redirectLocation.pathname + redirectLocation.search);
      } else if (renderProps) {
        const html = ReactDOM.renderToString(
                 React.createElement(Router.RouterContext, renderProps)
               );
        const page = swig.renderFile('views/index.html', { html: html });
        res.status(200).send(page);
      } else {
        res.status(404).send('Page Not Found');
      }
    }
  );
});

/**
 * Socket.io stuff
 */
import * as HTTP from 'http';
const server = HTTP.createServer(app);
import * as IO from 'socket.io';
const io = IO(server);
let onlineUsers = 0;

io.sockets.on('connection', function(socket) {
  onlineUsers++;

  io.sockets.emit('onlineUsers', { onlineUsers: onlineUsers });

  socket.on('disconnect', function() {
    onlineUsers--;
    io.sockets.emit('onlineUsers', { onlineUsers: onlineUsers });
  })
});

server.listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});