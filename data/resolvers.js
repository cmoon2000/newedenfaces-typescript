"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("underscore");
var connectors_1 = require("./connectors");
var resolvers = {
    Query: {
        character: function (_, args) {
            var name = new RegExp(args.name, 'i');
            return connectors_1.default
                .findOne({ name: name });
        },
        twoCharacters: function () {
            var choices = ["Female", "Male"];
            var randomGender = _.sample(choices);
            return connectors_1.default.find({ random: { $near: [Math.random(), 0] } })
                .where('voted', false)
                .where('gender', randomGender)
                .limit(2)
                .exec()
                .then(function (characters) {
                if (characters.length === 2) {
                    return characters;
                }
                var oppositeGender = _.first(_.without(choices, randomGender));
                return connectors_1.default
                    .find({ random: { $near: [Math.random(), 0] } })
                    .where('voted', false)
                    .where('gender', oppositeGender)
                    .limit(2)
                    .exec()
                    .then(function (characters) {
                    if (characters.length === 2) {
                        return characters;
                    }
                    return connectors_1.default
                        .update({}, { $set: { voted: false } }, { multi: true })
                        .exec()
                        .then(function () { return []; })
                        .catch(function (err) { return err; });
                })
                    .catch(function (err) { return err; });
            }).catch(function (err) { return err; });
        },
        count: function () {
            return connectors_1.default.count({})
                .then(function (count) { return count; })
                .catch(function (err) { return err; });
        },
        top: function (_foo, args) {
            var params = args.params;
            var conditions = {};
            _.each(params, function (value, key) {
                conditions[key] = new RegExp('^' + value + '$', 'i');
            });
            return connectors_1.default
                .find(conditions)
                .sort('-wins')
                .limit(100)
                .exec()
                .then(function (characters) {
                characters.sort(function (a, b) {
                    if (a.wins / (a.wins + a.losses) < b.wins / (b.wins + b.losses)) {
                        return 1;
                    }
                    if (a.wins / (a.wins + a.losses) > b.wins / (b.wins + b.losses)) {
                        return -1;
                    }
                    return 0;
                });
                return characters;
            })
                .catch(function (err) { return err; });
        },
        shame: function () {
            return connectors_1.default
                .find()
                .sort('-losses')
                .limit(100)
                .exec()
                .then(function (characters) { return characters; })
                .catch(function (err) { return err; });
        },
        characterById: function (_foo, args) {
            var id = args.id;
            return connectors_1.default
                .findOne({ characterId: id })
                .then(function (character) { return character; })
                .catch(function (err) { return err; });
        },
        stats: function () {
            return Promise.all([
                connectors_1.default.count({}),
                connectors_1.default.count({ race: 'Amarr' }),
                connectors_1.default.count({ race: 'Caldari' }),
                connectors_1.default.count({ race: 'Gallente' }),
                connectors_1.default.count({ race: 'Minmatar' }),
                connectors_1.default.count({ gender: 'Male' }),
                connectors_1.default.count({ gender: 'Female' }),
                connectors_1.default.aggregate({ $group: { _id: null, total: { $sum: '$wins' } } })
                    .then(function (totalVotes) {
                    return totalVotes.length ? totalVotes[0].total : 0;
                }),
                connectors_1.default
                    .find()
                    .sort('-wins')
                    .limit(100)
                    .select('race')
                    .exec()
                    .then(function (characters) {
                    var raceCount = _.countBy(characters, function (character) { return character.race; });
                    var max = _.max(raceCount, function (race) { return race; });
                    var inverted = _.invert(raceCount);
                    var topRace = inverted[max];
                    var topCount = raceCount[topRace];
                    return { topType: topRace, count: topCount };
                }),
                connectors_1.default
                    .find()
                    .sort('-wins')
                    .limit(100)
                    .select('bloodline')
                    .exec()
                    .then(function (characters) {
                    var bloodlineCount = _.countBy(characters, function (character) { return character.bloodline; });
                    var max = _.max(bloodlineCount, function (bloodline) { return bloodline; });
                    var inverted = _.invert(bloodlineCount);
                    var topBloodline = inverted[max];
                    var topCount = bloodlineCount[topBloodline];
                    return { topType: topBloodline, count: topCount };
                })
            ]).then(function (results) { return ({
                totalCount: results[0],
                amarrCount: results[1],
                caldariCount: results[2],
                gallenteCount: results[3],
                minmatarCount: results[4],
                maleCount: results[5],
                femaleCount: results[6],
                totalVotes: results[7],
                leadingRace: results[8],
                leadingBloodline: results[9]
            }); })
                .catch(function (err) { return err; });
        }
    },
    Mutation: {
        character: function (_root, args) {
            var character = new connectors_1.default(args.character);
            return character
                .save()
                .then(function (character) { return character; })
                .catch(function (err) { return err; });
        },
        report: function (_foo, args) {
            return connectors_1.default
                .findOne({ characterId: args.id })
                .then(function (character) {
                if (!character) {
                    return character;
                }
                character.reports++;
                if (character.reports > 4) {
                    character.remove();
                    return character;
                }
                return character.save().then(function (character) { return character; });
            })
                .catch(function (err) { return err; });
        }
    }
};
exports.default = resolvers;
