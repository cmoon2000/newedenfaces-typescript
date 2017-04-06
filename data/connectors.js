"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Mongoose = require("mongoose");
var config = require('../config');
var connectionTwo = Mongoose.createConnection(config.database);
connectionTwo.on('error', function () {
    console.info('Error From connectionTwo in file connectors.js: Could not connect to MongoDB. Did you forget to run `mongod`?');
});
var CharacterSchema = new Mongoose.Schema({
    characterId: { type: String, unique: true, index: true },
    name: String,
    race: String,
    gender: String,
    bloodline: String,
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    reports: { type: Number, default: 0 },
    random: { type: [Number], index: '2d' },
    voted: { type: Boolean, default: false }
});
var Character = Mongoose.model('characters', CharacterSchema);
exports.default = Character;
