// Babel ES6/JSX Compiler
require('babel-register');

import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';

import * as swig from 'swig';
import * as React from 'react';
import * as ReactDOM from 'react-dom/server';
import * as Router from 'react-router';
import * as mongoose from 'mongoose';
import * as logger from 'morgan';
import * as async from 'async';
import * as request from 'request';
import * as xml2js from 'xml2js';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import { graphql } from 'graphql';

import Character, { ICharacterModel } from  './models/character';
import routes from './app/routes';
import schema from './data/schema';
import resolvers from './data/resolvers';


const config: { database: string } = require('./config');

const app = express();

const executableSchema = makeExecutableSchema({
  typeDefs: [schema],
  resolvers
});

mongoose.connect(config.database);
mongoose.connection.on('error', function() {
    console.info('Error in file server.js: Could not connect to MongoDB. Did you forget to run `mongod`?');
});

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/graphql', bodyParser.json(), graphqlExpress({
  schema: executableSchema
}));

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql'
}));

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

            graphql(
              executableSchema,
              req.body.requestString,
              undefined,
              undefined,
              {
                characterId,
                name,
                race,
                bloodline,
                gender,
                random: [Math.random(), 0]
              }
            )
            .then(result => {
              res.send({ message: (result as any).data.character.name + ' has been added successfully!' });
            })
            .catch(err => next(err));
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
app.get('/api/characters', function(req, res, next) {
  graphql(executableSchema, req.query.requestString)
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      next(err);
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
app.get('/api/characters/count', function(req, res, next) {
  graphql(executableSchema, req.query.requestString)
    .then(result => {
      res.send(result)
    })
    .catch(err => {
      next(err);
    });
});

/**
 * GET /api/characters/search
 * Looks up a character by name. (case-insensitive)
 */
app.get('/api/characters/search', function(req, res, next) {
  graphql(
    executableSchema,
    req.query.requestString,
    undefined,
    undefined,
    { name: req.query.variables.name })
  .then(result => {
    res.send(result);
  })
  .catch(err => {
    next(err);
  });
});

/**
 * GET /api/characters/top
 * Return 100 highest ranked characters. Filter by gender, race and bloodline.
 */
app.get('/api/characters/top', function(req, res, next) {
  const params = req.query.variables ? req.query.variables.params : {};
  graphql(
    executableSchema,
    req.query.requestString,
    undefined,
    undefined,
    { params })
  .then(result => {
    res.send(result);
  })
  .catch(err => {
    next(err);
  });
});

/**
 * GET /api/characters/shame
 * Returns 100 lowest ranked characters.
 */
app.get('/api/characters/shame', function(req, res, next) {
  graphql(
      executableSchema,
      req.query.requestString
    )
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      next(err);
    });
});

/**
 * GET /api/characters/:id
 * Returns detailed character information
 */
app.get('/api/characters/:id', function(req, res, next) {
  graphql(
    executableSchema,
    req.query.requestString,
    undefined,
    undefined,
    { id: req.params.id as string }
  )
  .then(character => {
    if (!character) {
      return res.status(404).send({ message: 'Character not found.' });
    }

    return res.send(character);
  })
  .catch(err => {
    next(err);
  });
});

/**
 * POST /api/report
 * Reports a character. Character is removed after 4 reports.
 */
app.post('/api/report', function(req, res, next) {
  graphql(
    executableSchema,
    req.body.requestString,
    undefined,
    undefined,
    { id: req.body.characterId }
  )
  .then(character => {
    if(!character) {
      return res.status(404).send({ message: 'Character not found.' });
    }

    if((character as any).data.report.reports === 5) {
      return res.send({ message: (character as any).data.report.name + ' has been deleted.' });
    }

    return res.send({ message: (character as any).data.report.name + ' has been reported.' });
  })
  .catch(err => next(err));
});

/**
 * GET /api/stats
 * Returns characters statistics.
 */
app.get('/api/stats', function(req, res, next) {
  graphql(executableSchema, req.query.requestString)
    .then(result => res.send(result))
    .catch(err => next(err));
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