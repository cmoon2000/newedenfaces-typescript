"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('babel-register');
var path = require("path");
var express = require("express");
var bodyParser = require("body-parser");
var swig = require("swig");
var React = require("react");
var ReactDOM = require("react-dom/server");
var Router = require("react-router");
var mongoose = require("mongoose");
var logger = require("morgan");
var async = require("async");
var request = require("request");
var xml2js = require("xml2js");
var graphql_server_express_1 = require("graphql-server-express");
var graphql_tools_1 = require("graphql-tools");
var graphql_1 = require("graphql");
var character_1 = require("./models/character");
var routes_1 = require("./app/routes");
var schema_1 = require("./data/schema");
var resolvers_1 = require("./data/resolvers");
var config = require('./config');
var app = express();
var executableSchema = graphql_tools_1.makeExecutableSchema({
    typeDefs: [schema_1.default],
    resolvers: resolvers_1.default
});
mongoose.connect(config.database);
mongoose.connection.on('error', function () {
    console.info('Error in file server.js: Could not connect to MongoDB. Did you forget to run `mongod`?');
});
app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/graphql', bodyParser.json(), graphql_server_express_1.graphqlExpress({
    schema: executableSchema
}));
app.use('/graphiql', graphql_server_express_1.graphiqlExpress({
    endpointURL: '/graphql'
}));
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
                        graphql_1.graphql(executableSchema, req.body.requestString, undefined, undefined, {
                            characterId: characterId,
                            name: name,
                            race: race,
                            bloodline: bloodline,
                            gender: gender,
                            random: [Math.random(), 0]
                        })
                            .then(function (result) {
                            res.send({ message: result.data.character.name + ' has been added successfully!' });
                        })
                            .catch(function (err) { return next(err); });
                    }
                    catch (e) {
                        res.status(404).send({ message: characterName + ' is not a registered citizen of New Eden.' });
                    }
                });
            });
        }
    ]);
});
app.get('/api/characters', function (req, res, next) {
    graphql_1.graphql(executableSchema, req.query.requestString)
        .then(function (result) {
        res.send(result);
    })
        .catch(function (err) {
        next(err);
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
app.get('/api/characters/count', function (req, res, next) {
    graphql_1.graphql(executableSchema, req.query.requestString)
        .then(function (result) {
        res.send(result);
    })
        .catch(function (err) {
        next(err);
    });
});
app.get('/api/characters/search', function (req, res, next) {
    graphql_1.graphql(executableSchema, req.query.requestString, undefined, undefined, { name: req.query.variables.name })
        .then(function (result) {
        res.send(result);
    })
        .catch(function (err) {
        next(err);
    });
});
app.get('/api/characters/top', function (req, res, next) {
    var params = req.query.variables ? req.query.variables.params : {};
    graphql_1.graphql(executableSchema, req.query.requestString, undefined, undefined, { params: params })
        .then(function (result) {
        res.send(result);
    })
        .catch(function (err) {
        next(err);
    });
});
app.get('/api/characters/shame', function (req, res, next) {
    graphql_1.graphql(executableSchema, req.query.requestString)
        .then(function (result) {
        res.send(result);
    })
        .catch(function (err) {
        next(err);
    });
});
app.get('/api/characters/:id', function (req, res, next) {
    graphql_1.graphql(executableSchema, req.query.requestString, undefined, undefined, { id: req.params.id })
        .then(function (character) {
        if (!character) {
            return res.status(404).send({ message: 'Character not found.' });
        }
        return res.send(character);
    })
        .catch(function (err) {
        next(err);
    });
});
app.post('/api/report', function (req, res, next) {
    graphql_1.graphql(executableSchema, req.body.requestString, undefined, undefined, { id: req.body.characterId })
        .then(function (character) {
        if (!character) {
            return res.status(404).send({ message: 'Character not found.' });
        }
        if (character.data.report.reports === 5) {
            return res.send({ message: character.data.report.name + ' has been deleted.' });
        }
        return res.send({ message: character.data.report.name + ' has been reported.' });
    })
        .catch(function (err) { return next(err); });
});
app.get('/api/stats', function (req, res, next) {
    graphql_1.graphql(executableSchema, req.query.requestString)
        .then(function (result) { return res.send(result); })
        .catch(function (err) { return next(err); });
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
