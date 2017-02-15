"use strict";
require('babel-register');
var path = require("path");
var express = require("express");
var bodyParser = require("body-parser");
var swig = require("swig");
var React = require("react");
var ReactDOM = require("react-dom/server");
var Router = require("react-router");
var _ = require("underscore");
var mongoose = require("mongoose");
var logger = require("morgan");
var async = require("async");
var request = require("request");
var xml2js = require("xml2js");
var character_1 = require("./models/character");
var routes_1 = require("./app/routes");
var config = require('./config');
var app = express();
mongoose.connect(config.database);
mongoose.connection.on('error', function () {
    console.info('Error: Could not connect to MongoDB. Did you forget to run `mongod`?');
});
app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.post('/api/characters', function (req, res, next) {
    var gender = req.body.gender;
    var characterName = req.body.name;
    var characterIdLookupUrl = 'https://api.eveonline.com/eve/CharacterID.xml.aspx?names=' + characterName;
    var parser = new xml2js.Parser();
    async.waterfall([
        function (callback) {
            request.get(characterIdLookupUrl, function (err, _request, xml) {
                if (err)
                    return next(err);
                parser.parseString(xml, function (err, parsedXml) {
                    if (err)
                        return next(err);
                    try {
                        var characterId_1 = parsedXml.eveapi.result[0].rowset[0].row[0].$.characterID;
                        character_1.default.findOne({ characterId: characterId_1 }, function (err, character) {
                            if (err)
                                return next(err);
                            if (character) {
                                return res.status(409).send({ message: character.name + ' is already in the database.' });
                            }
                            callback(err, characterId_1);
                        });
                    }
                    catch (e) {
                        return res.status(400).send({ message: 'XML Parse Error' });
                    }
                });
            });
        },
        function (characterId) {
            var characterInfoUrl = 'https://api.eveonline.com/eve/CharacterInfo.xml.aspx?characterID=' + characterId;
            request.get({ url: characterInfoUrl }, function (err, _request, xml) {
                if (err)
                    return next(err);
                parser.parseString(xml, function (err, parsedXml) {
                    if (err)
                        return res.send(err);
                    try {
                        var name = parsedXml.eveapi.result[0].characterName[0];
                        var race = parsedXml.eveapi.result[0].race[0];
                        var bloodline = parsedXml.eveapi.result[0].bloodline[0];
                        var character = new character_1.default({
                            characterId: characterId,
                            name: name,
                            race: race,
                            bloodline: bloodline,
                            gender: gender,
                            random: [Math.random(), 0]
                        });
                        character.save(function (err) {
                            if (err)
                                return next(err);
                            res.send({ message: characterName + ' has been added successfully!' });
                        });
                    }
                    catch (e) {
                        res.status(404).send({ message: characterName + ' is not a registered citizen of New Eden.' });
                    }
                });
            });
        }
    ]);
});
app.get('/api/characters', function (_req, res, next) {
    var choices = ['Female', 'Male'];
    var randomGender = _.sample(choices);
    character_1.default.find({ random: { $near: [Math.random(), 0] } })
        .where('voted', false)
        .where('gender', randomGender)
        .limit(2)
        .exec(function (err, characters) {
        if (err)
            return next(err);
        if (characters.length === 2) {
            return res.send(characters);
        }
        var oppositeGender = _.first(_.without(choices, randomGender));
        character_1.default
            .find({ random: { $near: [Math.random(), 0] } })
            .where('voted', false)
            .where('gender', oppositeGender)
            .limit(2)
            .exec(function (err, characters) {
            if (err)
                return next(err);
            if (characters.length === 2) {
                return res.send(characters);
            }
            character_1.default.update({}, { $set: { voted: false } }, { multi: true }, function (err) {
                if (err)
                    return next(err);
                res.send([]);
            });
        });
    });
});
app.put('/api/characters', function (req, res, next) {
    var winner = req.body.winner;
    var loser = req.body.loser;
    if (!winner || !loser) {
        return res.status(400).send({ message: 'Voting requires two characters.' });
    }
    if (winner === loser) {
        return res.status(400).send({ message: 'Cannot Vote for and against the same character.' });
    }
    async.parallel([
        function (callback) {
            character_1.default.findOne({ characterId: winner }, function (err, winner) {
                callback(err, winner);
            });
        },
        function (callback) {
            character_1.default.findOne({ characterId: loser }, function (err, loser) {
                callback(err, loser);
            });
        }
    ], function (err, results) {
        if (err)
            return next(err);
        var winner = results[0];
        var loser = results[1];
        if (!winner || !loser) {
            return res.status(404).send({ message: 'One of the characters no longer exists.' });
        }
        if (winner.voted || loser.voted) {
            return res.status(200).end();
        }
        async.parallel([
            function (callback) {
                winner.wins++;
                winner.voted = true;
                winner.random = [Math.random(), 0];
                winner.save(function (err) {
                    callback(err);
                });
            },
            function (callback) {
                loser.losses++;
                loser.voted = true;
                loser.random = [Math.random(), 0];
                loser.save(function (err) {
                    callback(err);
                });
            }
        ], function (err) {
            if (err)
                return next(err);
            res.status(200).end();
        });
    });
});
app.get('/api/characters/count', function (_req, res, next) {
    character_1.default.count({}, function (err, count) {
        if (err)
            return next(err);
        res.send({ count: count });
    });
});
app.get('/api/characters/search', function (req, res, next) {
    var characterName = new RegExp(req.query.name, 'i');
    character_1.default.findOne({ name: characterName }, function (err, character) {
        if (err)
            return next(err);
        if (!character) {
            return res.status(404).send({ message: 'Character not found.' });
        }
        res.send(character);
    });
});
app.get('/api/characters/top', function (req, res, next) {
    var params = req.query;
    var conditions = {};
    _.each(params, function (value, key) {
        conditions[key] = new RegExp('^' + value + '$', 'i');
    });
    character_1.default
        .find(conditions)
        .sort('-wins')
        .limit(100)
        .exec(function (err, characters) {
        if (err)
            return next(err);
        characters.sort(function (a, b) {
            if (a.wins / (a.wins + a.losses) < b.wins / (b.wins + b.losses)) {
                return 1;
            }
            if (a.wins / (a.wins + a.losses) > b.wins / (b.wins + b.losses)) {
                return -1;
            }
            return 0;
        });
        res.send(characters);
    });
});
app.get('/api/characters/shame', function (_req, res, next) {
    character_1.default
        .find()
        .sort('-losses')
        .limit(100)
        .exec(function (err, characters) {
        if (err)
            return next(err);
        res.send(characters);
    });
});
app.get('/api/characters/:id', function (req, res, next) {
    var id = req.params.id;
    character_1.default.findOne({ characterId: id }, function (err, character) {
        if (err)
            return next(err);
        if (!character) {
            return res.status(404).send({ message: 'Character not found.' });
        }
        res.send(character);
    });
});
app.post('/api/report', function (req, res, next) {
    var characterId = req.body.characterId;
    character_1.default.findOne({ characterId: characterId }, function (err, character) {
        if (err)
            return next(err);
        if (!character) {
            return res.status(404).send({ message: 'Character not found.' });
        }
        character.reports++;
        if (character.reports > 4) {
            character.remove();
            return res.send({ message: character.name + ' has been deleted.' });
        }
        character.save(function (err) {
            if (err)
                return next(err);
            res.send({ message: character.name + ' has been reported.' });
        });
    });
});
app.get('/api/stats', function (_req, res, next) {
    async.parallel([
        function (callback) {
            character_1.default.count({}, function (err, count) {
                callback(err, count);
            });
        },
        function (callback) {
            character_1.default.count({ race: 'Amarr' }, function (err, amarrCount) {
                callback(err, amarrCount);
            });
        },
        function (callback) {
            character_1.default.count({ race: 'Caldari' }, function (err, caldariCount) {
                callback(err, caldariCount);
            });
        },
        function (callback) {
            character_1.default.count({ race: 'Gallente' }, function (err, gallenteCount) {
                callback(err, gallenteCount);
            });
        },
        function (callback) {
            character_1.default.count({ race: 'Minmatar' }, function (err, minmatarCount) {
                callback(err, minmatarCount);
            });
        },
        function (callback) {
            character_1.default.count({ gender: 'Male' }, function (err, maleCount) {
                callback(err, maleCount);
            });
        },
        function (callback) {
            character_1.default.count({ gender: 'Female' }, function (err, femaleCount) {
                callback(err, femaleCount);
            });
        },
        function (callback) {
            character_1.default.aggregate({ $group: { _id: null, total: { $sum: '$wins' } } }, function (err, totalVotes) {
                var total = totalVotes.length ? totalVotes[0].total : 0;
                callback(err, total);
            });
        },
        function (callback) {
            character_1.default
                .find()
                .sort('-wins')
                .limit(100)
                .select('race')
                .exec(function (err, characters) {
                if (err)
                    return next(err);
                var raceCount = _.countBy(characters, function (character) { return character.race; });
                var max = _.max(raceCount, function (race) { return race; });
                var inverted = _.invert(raceCount);
                var topRace = inverted[max];
                var topCount = raceCount[topRace];
                callback(err, { race: topRace, count: topCount });
            });
        },
        function (callback) {
            character_1.default
                .find()
                .sort('-wins')
                .limit(100)
                .select('bloodline')
                .exec(function (err, characters) {
                if (err)
                    return next(err);
                var bloodlineCount = _.countBy(characters, function (character) { return character.bloodline; });
                var max = _.max(bloodlineCount, function (bloodline) { return bloodline; });
                var inverted = _.invert(bloodlineCount);
                var topBloodline = inverted[max];
                var topCount = bloodlineCount[topBloodline];
                callback(err, { bloodline: topBloodline, count: topCount });
            });
        }
    ], function (err, results) {
        if (err)
            return next(err);
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
app.use(function (req, res) {
    Router.match({ routes: routes_1.default, location: req.url }, function (err, redirectLocation, renderProps) {
        if (err) {
            res.status(500).send(err.message);
        }
        else if (redirectLocation) {
            res.status(302).redirect(redirectLocation.pathname + redirectLocation.search);
        }
        else if (renderProps) {
            var html = ReactDOM.renderToString(React.createElement(Router.RouterContext, renderProps));
            var page = swig.renderFile('views/index.html', { html: html });
            res.status(200).send(page);
        }
        else {
            res.status(404).send('Page Not Found');
        }
    });
});
var HTTP = require("http");
var server = HTTP.createServer(app);
var IO = require("socket.io");
var io = IO(server);
var onlineUsers = 0;
io.sockets.on('connection', function (socket) {
    onlineUsers++;
    io.sockets.emit('onlineUsers', { onlineUsers: onlineUsers });
    socket.on('disconnect', function () {
        onlineUsers--;
        io.sockets.emit('onlineUsers', { onlineUsers: onlineUsers });
    });
});
server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
